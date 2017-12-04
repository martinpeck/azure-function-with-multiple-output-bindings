module.exports = function (context, req) {
    context.log('START: blob-queue-blobbinding-queuebinding');

    context.bindings.outblob  = "blob-queue-blobbinding-queuebinding";
    context.bindings.outqueue = "{'message': 'blob-queue-blobbinding-queuebinding'}";
    
    context.log('END: blob-queue-blobbinding-queuebinding');
    
    context.done();
};