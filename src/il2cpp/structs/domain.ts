namespace Il2Cpp {
    /** Represents a `Il2CppDomain`. */
    export class Domain {
        protected constructor() {}

        /** Gets the assemblies that have been loaded into the execution context of the application domain. */
        @lazy
        static get assemblies(): Il2Cpp.Assembly[] {
            const sizePointer = Memory.alloc(Process.pointerSize);
            const startPointer = Il2Cpp.Api._domainGetAssemblies(this, sizePointer);

            const count = sizePointer.readInt();
            const array: Il2Cpp.Assembly[] = new globalThis.Array(count);

            for (let i = 0; i < count; i++) {
                array[i] = new Il2Cpp.Assembly(startPointer.add(i * Process.pointerSize).readPointer());
            }

            if (count == 0) {
                for (const assemblyObject of this.object.method<Il2Cpp.Array<Il2Cpp.Object>>("GetAssemblies").overload().invoke()) {
                    array.push(new Il2Cpp.Assembly(assemblyObject.field<NativePointer>("_mono_assembly").value));
                }
            }

            return array;
        }

        /** Gets the application domain handle. */
        @lazy
        static get handle(): NativePointer {
            return Il2Cpp.Api._domainGet();
        }

        /** Gets the encompassing object of the application domain. */
        @lazy
        static get object(): Il2Cpp.Object {
            return new Il2Cpp.Object(Il2Cpp.Api._domainGetObject());
        }

        /** Opens and loads the assembly with the given name. */
        static assembly(name: string): Il2Cpp.Assembly {
            // prettier-ignore
            return this.tryAssembly(name) ?? keyNotFound(name, "Domain", this.assemblies.map(_ => _.name));
        }

        /** Attached a new thread to the application domain. */
        static attach(): Il2Cpp.Thread {
            return new Il2Cpp.Thread(Il2Cpp.Api._threadAttach(this));
        }

        /** Opens and loads the assembly with the given name. */
        static tryAssembly(name: string): Il2Cpp.Assembly | null {
            const handle = Il2Cpp.Api._domainAssemblyOpen(this, Memory.allocUtf8String(name));
            return handle.isNull() ? null : new Il2Cpp.Assembly(handle);
        }
    }
}
