using System.Net;
public static void Run(HttpRequestMessage req, out string outqueue, out string outblob, TraceWriter log)
{
    log.Info("START: blob-queue-blobbinding-queuebinding");

    outqueue = "{'message': 'blob-queue-blobbinding-queuebinding'}";
    outblob = "blob-queue-blobbinding-queuebinding";

    log.Info("END: blob-queue-blobbinding-queuebinding");
}