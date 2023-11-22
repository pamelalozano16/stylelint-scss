"use strict";

const { messages, ruleName } = require("..");

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      @import "fff";
    `,
      description: "Single file, no underscore, double quotes."
    }
  ],

  reject: [
    {
      code: `
      @import "http://fff.com";
    `,
      line: 2,
      message: messages.expected,
      description: "Import with http://"
    },
    {
      code: `
      @import "https://fff.com";
    `,
      line: 2,
      message: messages.expected,
      description: "Import with https://"
    },
    {
      code: `
      @import "fff.css";
    `,
      line: 2,
      message: messages.expected,
      description: "Import with .css extension"
    },
    {
      code: `
      @import url("fff.com");
    `,
      line: 2,
      message: messages.expected,
      description: "Import with url()."
    },
    {
      code: `
      @import "fff" layer(layer-name);
    `,
      line: 2,
      message: messages.expected,
      description: "Import with layer modifier."
    },
    {
      code: `
      @import "fff" supports(supports-condition);
    `,
      line: 2,
      message: messages.expected,
      description: "Import with supports modifier."
    },
    {
      code: `
      @import "common" screen and (orientation: landscape);;
    `,
      line: 2,
      message: messages.expected,
      description: "Import with media modifier."
    }
  ]
});
