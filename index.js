"use strict";

import pino     from "pino";
import config   from "config";
import merge    from "merge";
import imessage from "osa-imessage";
import Snips    from "../snips-chat/lib/snips.js";

const logger = pino({ level: "debug" });

const snips_config = merge.recursive(true, {
  logger: logger
}, config.get("snips_chat"));

const snips = new Snips(snips_config);

snips.on("text", function(who, what) {
  logger.info(`Send to ${who}: ${what}`);
  imessage.send(who, what);
});

imessage.listen().on( "message", (msg) => {
  if (msg.fromMe) {
    logger.debug(`ignoring message from myself: ${msg.text}`);
    return;
  }

  if (!config.get("allowed_senders").includes(msg.handle)) {
    logger.warn(`ignoring message from unknown sender: ${msg.handle}: ${msg.text}`);
    return;
  }

  snips.push(msg.handle, msg.text);
} );
