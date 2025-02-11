namespace Il2Cpp {
    /** */
    export function installExceptionListener(targetThread: "current" | "all" = "current"): InvocationListener {
        const currentThread = Il2Cpp.api.threadGetCurrent();

        return Interceptor.attach(Il2Cpp.module.getExportByName("__cxa_throw"), function (args) {
            if (targetThread == "current" && !Il2Cpp.api.threadGetCurrent().equals(currentThread)) {
                return;
            }

            inform(new Il2Cpp.Object(args[0].readPointer()));
        });
    }
}
