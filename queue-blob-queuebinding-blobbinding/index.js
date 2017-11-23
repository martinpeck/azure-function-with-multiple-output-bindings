module.exports = function (context, req) {
    context.log('START: queue-blob-queuebinding-blobbinding');

    context.bindings.outqueue = "{'message': 'queue-blob-queuebinding-blobbinding'}";
    context.bindings.outblob  = "queue-blob-queuebinding-blobbinding";
    
    context.log('END: queue-blob-queuebinding-blobbinding');
    
    context.done();
};