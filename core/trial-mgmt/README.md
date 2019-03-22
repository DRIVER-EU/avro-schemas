# Purpose of the messages

From the perspective of managing a trial or exercise, we needed a couple of extra messages: phase, role player message and session management messages.

## Session management message

The `system_session_mgmt-value.avsc` message has the purpose to tell all participating systems that a new session has started. In this context, a session is one run of a scenario. In a session, all messages, responses and observations are gathered by the After-Action-Review tool for later examination.

## Phase message

The `system_phase_message-value.avsc` message is a very simple message to indicate that a new phase in the active session has started. It is used to more easily differentiate between, e.g. preparation and post-incident.

## Role player message

A role player is a person who performs an 'act' in the current scenario. It may be a very literal act, in which the role player performs the role of a victim, or it may be more subtle, such as calling one of the participants, or sending an email or tweet manually. It may even be instructing a simulator to start a sequence of events.

The `system_role_player-value.avsc` message contains a summary of the information and it will be sent twice: initially, when the role player is requested to perform the role, and finally, when the role player is done and provides a manual confirmation (and optional comment).
