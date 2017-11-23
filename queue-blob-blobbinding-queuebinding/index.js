module.exports = function (context, req) {
    context.log('START: queue-blob-blobbinding-queuebinding');

    context.bindings.outqueue = "{'message': 'queue-blob-blobbinding-queuebinding'}";
    context.bindings.outblob  = "queue-blob-blobbinding-queuebinding";
    
    context.log('END: queue-blob-blobbinding-queuebinding');
    
    context.done();
};