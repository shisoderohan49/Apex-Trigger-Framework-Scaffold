trigger TRIGGER_NAME on OBJECT_API_NAME (
    before insert,after insert,
    before update,after update,
    before delete,after delete
){
    new TRIGGER_HANDLER_NAME().run();
}