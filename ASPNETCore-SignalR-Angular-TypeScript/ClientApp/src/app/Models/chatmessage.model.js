"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** represent chat message class */
var ChatMessage = /** @class */ (function () {
    function ChatMessage(user, touser, message) {
        if (user === void 0) { user = ''; }
        if (touser === void 0) { touser = ''; }
        if (message === void 0) { message = ''; }
        this.user = user;
        this.touser = touser;
        this.message = message;
    }
    return ChatMessage;
}());
exports.ChatMessage = ChatMessage;
//# sourceMappingURL=chatmessage.model.js.map