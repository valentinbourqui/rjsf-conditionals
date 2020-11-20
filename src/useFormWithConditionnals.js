import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";

import { toError } from "./utils";
import rulesRunner from "./rulesRunner";

import { DEFAULT_ACTIONS } from "./actions";
import validateAction from "./actions/validateAction";
import env from "./env";

const { utils } = require("@rjsf/core");
const { deepEquals } = utils;
const noop = () => {};

/**
 * Usage:
 * const { schema, uiSchema } = useFormWithConditionnals(formData, schema, uiSchema, rules, onDataChange, Engine, extraActions)
 * return { schema, uiSchema }
 * @param formData
 * @param schema
 * @param uiSchema
 * @param rules
 * @param onDataChange
 * @param Engine
 * @param [extraActions]
 * @return <object>
 */
const useFormWithConditionnals = (
  formData,
  schema,
  uiSchema,
  rules,
  onDataChange = noop,
  Engine,
  extraActions = {}
) => {
  // Hooks params validation
  useEffect(() => {
    if (env.isDevelopment()) {
      const propTypes = {
        Engine: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
          .isRequired,
        rules: PropTypes.arrayOf(
          PropTypes.shape({
            conditions: PropTypes.object.isRequired,
            order: PropTypes.number,
            event: PropTypes.oneOfType([
              PropTypes.shape({
                type: PropTypes.string.isRequired,
              }),
              PropTypes.arrayOf(
                PropTypes.shape({
                  type: PropTypes.string.isRequired,
                })
              ),
            ]),
          })
        ).isRequired,
        extraActions: PropTypes.object,
      };

      PropTypes.checkPropTypes(
        propTypes,
        { rules, Engine, extraActions },
        "props",
        "rjsf-conditionals"
      );

      rules
        .reduce((agg, { event }) => agg.concat(event), [])
        .forEach(({ type, params }) => {
          // Find associated action
          let action = extraActions[type]
            ? extraActions[type]
            : DEFAULT_ACTIONS[type];
          if (action === undefined) {
            toError(`Rule contains invalid action "${type}"`);
            return;
          }

          validateAction(action, params, schema, uiSchema);
        });
    }
  }, [Engine, extraActions, rules, schema, uiSchema]);

  // Create the rules runner
  const runRules = useMemo(
    () => rulesRunner(schema, uiSchema, rules, Engine, extraActions),
    [Engine, extraActions, rules, schema, uiSchema]
  );

  // Keep a ref of previous formData so we can deep compare in
  // order to determine if we need to trigger rules again.
  const lastFormData = useRef(formData);
  useEffect(() => {
    lastFormData.current = formData;
  }, [formData]);

  const [schemas, setSchemas] = useState({
    schema: {},
    uiSchema: {},
  });

  useEffect(() => {
    // Does formdata changed ?
    const currentFormData = { entity: formData };
    let formDataChanged = !deepEquals(currentFormData, lastFormData.current);

    if (formDataChanged || !schemas.schema) {
      runRules(currentFormData).then((conf) => {
        const newSchemas = { schema: conf.schema, uiSchema: conf.uiSchema };
        const dataChanged = !deepEquals(currentFormData, conf.formData);
        const schemasChanged = !deepEquals(newSchemas, schemas);

        if (schemasChanged) {
          setSchemas(newSchemas);
        }

        if (dataChanged) {
          onDataChange({
            ...conf,
            formData: conf.formData.entity,
          });
        }
      });
    }
  }, [formData, onDataChange, runRules, schemas]);

  return schemas;
};

export default useFormWithConditionnals;
