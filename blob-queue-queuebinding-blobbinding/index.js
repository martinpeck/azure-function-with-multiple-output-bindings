module.exports = function (context, req) {
    context.log('START: blob-queue-queuebinding-blobbinding');

    context.bindings.outblob  = "blob-queue-queuebinding-blobbinding";
    context.bindings.outqueue = "{'message': 'blob-queue-queuebinding-blobbinding'}";
    
    context.log('END: blob-queue-queuebinding-blobbinding');
    
    context.done();
};