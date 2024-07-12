public with sharing class TRIGGER_SERVICES_CLASS {
    public static void beforeInsertOperations(List<OBJECT_API_NAME> newRecords){
        // Add your logic here
    }

    public static void afterInsertOperations(List<OBJECT_API_NAME> newRecords){
        // Add your logic here
    }

    public static void beforeUpdateOperations(List<OBJECT_API_NAME> newRecords, Map<Id,OBJECT_API_NAME> oldRecordMap){
        // Add your logic here
    }

    public static void afterUpdateOperations(List<OBJECT_API_NAME> newRecords, Map<Id,OBJECT_API_NAME> oldRecordMap){
        // Add your logic here
    }

    public static void beforeDeleteOperations(){
        // Add your logic here
    }

    public static void afterDeleteOperations(){
        // Add your logic here
    }
}