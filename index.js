"use strict";

import pino     from "pino";
import config   from "config";
import merge    from "merge";
import imessage from "osa-imessage";
import Snips    from "../snips-chat/lib/snips.js";

const logger = pino({ level: "debug" });
const snips  = new Snips(config.get("snips_chat"));

snips.on("message", function(who, what) {
  logger.info(`Send to ${who}: ${what}`);
  imessage.send(who, what);
});

// snips.on("connect", function() {
  imessage.listen().on( "message", (msg) => {
    if (msg.fromMe) {
      logger.debug(`ignoring message from myself: ${msg.text}`);
      return;
    }

    if (!config.get("allowed_senders").includes(msg.handle)) {
      logger.warn(`ignoring message from unknown sender: ${msg.handle}: ${msg.text}`);
      return;
    }

    logger.debug(`Processing message: ${msg.handle}: ${msg.text}`)
    snips.push(msg.handle, msg.text);
  } );

  logger.info("Waiting for messages");
// });
