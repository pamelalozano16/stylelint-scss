"use strict";

const { utils } = require("stylelint");
const namespace = require("../../utils/namespace");
const ruleUrl = require("../../utils/ruleUrl");

const ruleName = namespace("no-native-at-import");

const messages = utils.ruleMessages(ruleName, {
  expected: `CSS @import is not allowed in MSS Sass Stack`
});

const meta = {
  url: ruleUrl(ruleName)
};

// https://drafts.csswg.org/mediaqueries/#media-types
// https://developer.mozilla.org/en-US/docs/Web/CSS/@import#formal_syntax
const modifiers = [
  "all",
  "print",
  "screen",
  "speech",
  "tv",
  "tty",
  "projection",
  "handheld",
  "braille",
  "embossed",
  "orientation",
  "aural",
  "layer",
  "supports"
];

const modifiersRE = new RegExp(`${modifiers.join("|")}(\\(|\\s+)`, "i");
const stripPath = path =>
  path.replace(/^\s*(["'])\s*/, "").replace(/\s*(["'])\s*$/, "");

function rule(actual) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    root.walkAtRules("import", node => {
      const paths = node.params.split(/["']\s*,/);
      const queries = paths.filter(path => modifiersRE.test(path.trim()));
      if (queries.length > 0) {
        utils.report({
          message: messages.expected,
          node,
          result,
          ruleName
        });
        return;
      }

      // Processing comma-separated lists of import paths
      paths.forEach(path => {
        // Stripping trailing quotes and whitespaces, if any
        const pathStripped = stripPath(path);

        // Skipping importing CSS: url(), ".css", URI with a protocol
        if (
          pathStripped.slice(0, 4) === "url(" ||
          pathStripped.slice(-4) === ".css" ||
          pathStripped.search("//") !== -1
        ) {
          utils.report({
            message: messages.expected,
            node,
            result,
            ruleName
          });
          return;
        }
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
