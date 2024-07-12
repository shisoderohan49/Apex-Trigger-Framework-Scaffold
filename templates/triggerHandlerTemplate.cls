public with sharing class TRIGGER_HANDLER_NAME{
    private List<OBJECT_API_NAME> newRecords;
    private List<OBJECT_API_NAME> oldRecords;
    private Map<Id,OBJECT_API_NAME> newRecordMap;
    private Map<Id,OBJECT_API_NAME> oldRecordMap;

    public TRIGGER_HANDLER_NAME(){
        this.newRecords = (List<OBJECT_API_NAME>) Trigger.new;
        this.oldRecords = (List<OBJECT_API_NAME>) Trigger.old;
        this.newRecordMap = (Map<Id,OBJECT_API_NAME>) Trigger.newMap;
        this.oldRecordMap = (Map<Id,OBJECT_API_NAME>) Trigger.oldMap;
    }

    public static void beforeInsert(){
        // Add your logic here
        TRIGGER_SERVICES_CLASS.beforeInsertOperations(newRecords);
    }

    public static void afterInsert(){
        // Add your logic here
        TRIGGER_SERVICES_CLASS.afterInsertOperations(newRecords);
    }

    public static void beforeUpdate(){
        // Add your logic here
        TRIGGER_SERVICES_CLASS.beforeUpdateOperations(newRecords,oldRecordMap);
    }

    public static void afterUpdate(){
        // Add your logic here
        TRIGGER_SERVICES_CLASS.afterUpdateOperations(newRecords,oldRecordMap);
    }

    public static void beforeDelete(){
        // Add your logic here
        TRIGGER_SERVICES_CLASS.beforeDeleteOperations();
    }

    public static void afterDelete(){
        // Add your logic here
        TRIGGER_SERVICES_CLASS.afterDeleteOperations();
    }
}