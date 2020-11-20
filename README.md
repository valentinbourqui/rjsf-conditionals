![Node.js CI](https://github.com/ivarprudnikov/rjsf-conditionals/workflows/Node.js%20CI/badge.svg) [![npm version](https://badge.fury.io/js/rjsf-conditionals.svg)](https://badge.fury.io/js/rjsf-conditionals)

## [> SIMPLE DEMO PAGE](https://ivarprudnikov.github.io/rjsf-conditionals/)

# Form with conditionals

**It's a fork of https://github.com/RxNT/react-jsonschema-form-conditionals#readme to support `@rjsf/core v2`**

This project extends [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form) with
conditional logic, which allow to have more complicated logic expressed and controlled with JSON schema.
This is primarily useful for complicated schemas with extended business logic,
which are suspect to changes and need to be manageable and changeable without modifying running application.

If you need simple rule logic, that does not change a lot, you can use original [mozilla project](https://github.com/mozilla-services/react-jsonschema-form),
by following examples like https://jsfiddle.net/69z2wepo/68259/

The project is done to be fully compatible with mozilla,
without imposing additional limitations.

## Features

- Support for [Json Rules Engine](https://github.com/CacheControl/json-rules-engine) and [json-rules-engine-simplified](https://github.com/RxNT/json-rules-engine-simplified)
- Extensible action mechanism
- Configuration over coding
- Lightweight and extensible

## Installation

Install `rjsf-conditionals` by running:

```bash
npm i rjsf-conditionals
```

## Usage

The simplest example of using `rjsf-conditionals`

```jsx
import useFormWithConditionnals from "rjsf-conditionals";
import Engine from "json-rules-engine-simplified";
import Form from "@rjsf/core";

// ...

const rules = [
  {
    // ...
  },
];

const FormWithConditionals = (props) => {
  const { data, schema, uiSchema, handleChange, extraActions } = props;

  const schemas = useFormWithConditionnals(
    data,
    jsonSchemaObject,
    uiSchemaObject,
    rulesObject,
    handleChange,
    Engine,
    extraActions
  );

  return <Form {...props} {...schema} />;
};

ReactDOM.render(<FormWithConditionals />, document.querySelector("#app"));
```

To show case uses for this library we'll be using simple registration schema example

```jsx

import applyRules from 'rjsf-conditionals';
import Form from "@rjsf/core";

let schema = {
  definitions: {
    hobby: {
      type: "object",
      properties: {
        name: { type: "string" },
        durationInMonth: { "type": "integer" },
      }
    }
  },
  title: "A registration form",
  description: "A simple form example.",
  type: "object",
  required: [
    "firstName",
    "lastName"
  ],
  properties: {
    firstName: {
      type: "string",
      title: "First name"
    },
    lastName: {
      type: "string",
      title: "Last name"
    },
    age: {
      type: "integer",
      title: "Age",
    },
    bio: {
      type: "string",
      title: "Bio",
    },
    country: {
      type: "string",
      title: "Country"
    },
    state: {
      type: "string",
      title: "State"
    },
    zip: {
      type: "string",
      title: "ZIP"
    },
    password: {
      type: "string",
      title: "Password",
      minLength: 3
    },
    telephone: {
      type: "string",
      title: "Telephone",
      minLength: 10
    },
    hobbies: {
        type: "array",
        items: { "$ref": "#/definitions/hobby" }
    }
  }
}

let rules = [{
    ...
}]

let FormWithConditionals = (props) => {
  const {
    data,
    uiSchema,
    handleChange,
    extraActions
  } = props

  const schemas = useFormWithConditionnals(
    data,
    jsonSchemaObject,
    uiSchemaObject,
    rulesObject,
    handleChange,
    Engine,
    extraActions
  )

  return <Form {...props} {...schema} />
}

render((
  <FormWithConditionals />
), document.getElementById("app"));
```

Conditionals functionality is build using 2 things

- Rules engine ([Json Rules Engine](https://github.com/CacheControl/json-rules-engine) or [Simplified Json Rules Engine](https://github.com/RxNT/json-rules-engine-simplified))
- Schema action mechanism

Rules engine responsibility is to trigger events, action mechanism
performs needed actions on the requests.

# ⚠️ please note that next examples are outdated (please use now hook)

## Rules engine

Project supports 2 rules engines out of the box:

- [Json Rules Engine](https://github.com/CacheControl/json-rules-engine)
- [Simplified Json Rules Engine](https://github.com/RxNT/json-rules-engine-simplified)

In order to use either of those, you need to specify `Engine` in `applyRules` configuration.

For example:

To use [Simplified Json Rules Engine](https://github.com/RxNT/json-rules-engine-simplified), you can do following:

```js

import applyRules from 'rjsf-conditionals';
import Form from "@rjsf/core";

import Engine from 'json-rules-engine-simplified';

...

let FormWithConditionals = applyRules(schema, uiSchema, rules, Engine)(Form);

ReactDOM.render(
  <FormWithConditionals />,
  document.querySelector('#app')
);
```

To use [Json Rules Engine](https://github.com/RxNT/json-rules-engine-simplified), is almost the same:

```js
import applyRules from "rjsf-conditionals";
import Engine from "json-rules-engine";
import Form from "@rjsf/core";

// ...

let FormWithConditionals = applyRules(schema, uiSchema, rules, Engine)(Form);

ReactDOM.render(<FormWithConditionals />, document.querySelector("#app"));
```

### Extending rules engine

If non of the provided engines satisfies, your needs, you can
implement your own `Engine` which should
comply to following:

```js
class Engine {
  constructor(rules, schema) {}
  addRule = (rule) => {};
  run = (formData) => {
    return Promise[Event];
  };
}
```

Original `rules` and `schema` is used as a parameter for a factory call,
in order to be able to have additional functionality, such as rules to schema compliance validation,
like it's done in Simplified Json Rules Engine](https://github.com/RxNT/json-rules-engine-simplified)

## Schema action mechanism

Rules engine emits events, which are expected to have a `type` and `params` field,
`type` is used to distinguish action that is needed, `params` are used as input for that action:

```json
{
  "type": "remove",
  "params": {
    "field": "name"
  }
}
```

By default action mechanism defines a supported set of rules, which you can extend as needed:

- `remove` removes a field or set of fields from `schema` and `uiSchema`
- `require` makes a field or set of fields required

### Remove action

If you want to remove a field, your configuration should look like this:

```json
{
  "conditions": {},
  "event": {
    "type": "remove",
    "params": {
      "field": "password"
    }
  }
}
```

When `condition` is met, `password` will be removed from both `schema` and `uiSchema`.

In case you want to remove multiple fields `name`, `password`, rule should look like this:

```json
{
  "conditions": {},
  "event": {
    "type": "remove",
    "params": {
      "field": ["name", "password"]
    }
  }
}
```

To remove nested schema properties, use json dot notation. e.g. For schema object:

```json
{
  "type": "object",
  "properties": {
    "someParentWrapper": {
      "type": "object",
      "properties": {
        "booleanValA": {
          "type": "boolean",
          "title": "Some boolean input"
        },
        "booleanValB": {
          "type": "boolean",
          "title": "Another boolean input"
        }
      }
    }
  }
}
```

You can remove the nested booleanValA or booleanValB like so:

```json
{
  "conditions": {},
  "event": {
    "type": "remove",
    "params": {
      "field": "someParentWrapper.booleanValA"
    }
  }
}
```

### Require action

The same convention goes for `require` action

For a single field:

```json
{
  "conditions": {},
  "event": {
    "type": "require",
    "params": {
      "field": "password"
    }
  }
}
```

For multiple fields:

```json
{
  "conditions": {},
  "event": {
    "type": "require",
    "params": {
      "field": ["name", "password"]
    }
  }
}
```

## UiSchema actions

API defines a set of actions, that you can take on `uiSchema`, they cover most of the

- `uiAppend` appends `uiSchema` specified in params with an original `uiSchema`
- `uiOverride` replaces field in original `uiSchema` with fields in `params`, keeping unrelated entries
- `uiRepalce` replaces whole `uiSchema` with a conf schema

To show case, let's take a simple `schema`

```json
{
  "properties": {
    "lastName": { "type": "string" },
    "firstName": { "type": "string" },
    "nickName": { "type": "string" }
  }
}
```

and `uiSchema`

```json
{
  "ui:order": ["firstName"],
  "lastName": {
    "classNames": "col-md-1"
  },
  "firstName": {
    "ui:disabled": false,
    "num": 23
  },
  "nickName": {
    "classNames": "col-md-12"
  }
}
```

with event `params` something like this

```json
{
  "ui:order": ["lastName"],
  "lastName": {
    "classNames": "has-error"
  },
  "firstName": {
    "classNames": "col-md-6",
    "ui:disabled": true,
    "num": 22
  }
}
```

And look at different results depend on the choosen action.

### uiAppend

UiAppend can handle `arrays` and `string`, with fallback to `uiOverride` behavior for all other fields.

So the expected result `uiSchema` will be:

```json
{
  "ui:order": ["firstName", "lastName"],
  "lastName": {
    "classNames": "col-md-1 has-error"
  },
  "firstName": {
    "classNames": "col-md-6",
    "ui:disabled": true,
    "num": 22
  },
  "nickName": {
    "classNames": "col-md-12"
  }
}
```

In this case it

- added `lastName` to `ui:order` array,
- appended `has-error` to `classNames` in `lastName` field
- added `classNames` and enabled `firstName`
- as for the `num` in `firstName` it just overrode it

This is useful for example if you want to add some additional markup in your code, without touching layout that you've defined.

### uiOverride

`uiOverride` behaves similar to append, but instead of appending it completely replaces overlapping values

So the expected result `uiSchema` will be:

```json
{
  "ui:order": ["lastName"],
  "lastName": {
    "classNames": "has-error"
  },
  "firstName": {
    "classNames": "col-md-6",
    "ui:disabled": true,
    "num": 22
  },
  "nickName": {
    "classNames": "col-md-12"
  }
}
```

In this case it

- `ui:order` was replaced with configured value
- `className` for the `lastName` was replaced with `has-error`
- added `classNames` and enabled `firstName`
- as for the `num` in `firstName` it just overrode it

### uiReplace

`uiReplace` just replaces all fields in `uiSchema` with `params` fields, leaving unrelated fields untouched.

So the result `uiSchema` will be

```json
{
  "ui:order": ["lastName"],
  "lastName": {
    "classNames": "has-error"
  },
  "firstName": {
    "classNames": "col-md-6",
    "ui:disabled": true,
    "num": 22
  },
  "nickName": {
    "classNames": "col-md-12"
  }
}
```

## Extension mechanism

You can extend existing actions list, by specifying `extraActions` on the form.

Let's say we need to introduce `replaceClassNames` action, that
would just specify `classNames` `col-md-4` for all fields except for `ignore`d one.
We also want to trigger it only when `password` is `empty`.

This is how we can do this:

```js
import applyRules from 'rjsf-conditionals';
import Engine from 'json-rules-engine-simplified';
import Form from "@rjsf/core";

...

const rules = [
    {
        conditons: {
            password: "empty"
        },
        event: {
            type: "replaceClassNames",
            params: {
                classNames: "col-md-4",
                ignore: [ "password" ]
            }
        }
    }
];


let extraActions = {
    replaceClassNames: function(params, schema, uiSchema, formData) {
        Object.keys(schema.properties).forEach((field) => {
            if (uiSchema[field] === undefined) {
                uiSchema[field] = {}
            }
            uiSchema[field].classNames = params.classNames;
        }
    }
};

let FormWithConditionals = applyRules(schema, uiSchema, rules, Engine, extraActions)(Form);

ReactDOM.render(
  <FormWithConditionals/>,
  document.querySelector('#app')
);
```

Provided snippet does just that.

### Extension with calculated values

In case you need to calculate value, based on other field values, you can also do that.

Let's say we want to have schema with `a`, `b` and `sum` fields

```js
import applyRules from 'rjsf-conditionals';
import Engine from 'json-rules-engine-simplified';
import Form from "@rjsf/core";

...

const rules = [
    {
        conditons: {
            a: { not: "empty" },
            b: { not: "empty" }
        },
        event: {
            type: "updateSum"
        }
    }
];


let extraActions = {
    updateSum: function(params, schema, uiSchema, formData) {
        formData.sum = formData.a + formData.b;
    }
};

let FormWithConditionals = applyRules(schema, uiSchema, rules, Engine, extraActions)(Form);

ReactDOM.render(
  <FormWithConditionals/>,
  document.querySelector('#app')
);
```

This is how you can do that.

> WARNING!!! You need to be careful with a rules order, when using calculated values.
> Put calculation rules at the top of your rules specification.

For example, let's say you want to mark `sum` field, if you have sum `greater` than `10`. The rule would look something like this:

```json
{
  "conditions": {
    "sum": { "greater": 10 }
  },
  "event": {
    "type": "appendClass",
    "classNames": "has-success"
  }
}
```

But it will work only if you put it after `updateSum` rule, like this

```json
[
    {
        "conditons": {
            "a": { "not": "empty" },
            "b": { "not": "empty" }
        },
        "event": {
            "type": "updateSum"
        }
    },
    {
      "conditions": {
        "sum": { "greater" : 10 }
      },
      "event": {
        "type": "appendClass",
        "classNames": "has-success"
      }
    }
];
```

Otherwise it will work with **old `sum` values** and therefor show incorrect value.

### Rules order

Originally actions performed in sequence defined in the array. If you have interdependent rules, that you need to run in order
you can specify `order` on a rule, so that it would be executed first. Rules are executed based on order from lowest to highest with
rules without order executed last.

For example to make updateSum work regardless the order rules were added, you can do following:

```json
[
  {
    "conditions": {
      "sum": { "greater": 10 }
    },
    "order": 1,
    "event": {
      "type": "appendClass",
      "classNames": "has-success"
    }
  },
  {
    "conditons": {
      "a": { "not": "empty" },
      "b": { "not": "empty" }
    },
    "order": 0,
    "event": {
      "type": "updateSum"
    }
  }
]
```

Here although `updateSum` comes after `appendClass`, it will be executed first, since it has a lower order.

## Action validation mechanism

All default actions are validated by default, checking that field exists in the schema, to save you some headaches.
There are 2 levels of validation

- `propTypes` validation, using FB `prop-types` package
- explicit validation

You can define those validations in your actions as well, to improve actions usability.

All validation is disabled in production.

### Prop types action validation

This is reuse of familiar `prop-types` validation used with React components, and it's used in the same way:

In case of `require` it can look like this:

```js
require.propTypes = {
  field: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};
```

The rest is magic.

WARNING, the default behavior of `prop-types` is to send errors to console,
which you need to have running in order to see them.

For our `replaceClassNames` action, it can look like this:

```js
replaceClassNames.propTypes = {
  classNames: PropTypes.string.isRequired,
  ignore: PropTypes.arrayOf(PropTypes.string),
};
```

## Explicit validation

In order to provide more granular validation, you can specify validate function on
your action, that will receive `params`, `schema` and `uiSchema` so you could provide appropriate validation.

For example, validation for `require` can be done like this:

```js
require.validate = function ({ field }, schema, uiSchema) {
  if (Array.isArray(field)) {
    field
      .filter(
        (f) => schema && schema.properties && schema.properties[f] === undefined
      )
      .forEach((f) =>
        console.error(`Field  "${f}" is missing from schema on "require"`)
      );
  } else if (
    schema &&
    schema.properties &&
    schema.properties[field] === undefined
  ) {
    console.error(`Field  "${field}" is missing from schema on "require"`);
  }
};
```

Validation is not mandatory, and will be done only if field is provided.

For our `replaceClassNames` action, it would look similar:

```js
replaceClassNames.validate = function ({ ignore }, schema, uiSchema) {
  if (Array.isArray(field)) {
    ignore
      .filter(
        (f) => schema && schema.properties && schema.properties[f] === undefined
      )
      .forEach((f) =>
        console.error(
          `Field  "${f}" is missing from schema on "replaceClassNames"`
        )
      );
  } else if (
    schema &&
    schema.properties &&
    schema.properties[ignore] === undefined
  ) {
    console.error(
      `Field  "${ignore}" is missing from schema on "replaceClassNames"`
    );
  }
};
```

# Listening to configuration changes

In order to listen for configuration changes you can specify `onSchemaConfChange`, which will be notified every time `schema` or `uiSchema` changes it's value.

```js
let FormWithConditionals = applyRules(
  schema,
  uiSchema,
  rules,
  Engine,
  extraActions
)(Form);

ReactDOM.render(
  <FormWithConditionals
    onSchemaConfChange={({ schema, uiSchema }) => {
      console.log("configuration changed");
    }}
  />,
  document.querySelector("#app")
);
```

## Contribute

- Issue Tracker: https://github.com/ivarprudnikov/rjsf-conditionals/issues
- Source Code: https://github.com/ivarprudnikov/rjsf-conditionals

## Support

If you are having issues, please let us know.

## License

The project is licensed under the Apache-2.0 license.
