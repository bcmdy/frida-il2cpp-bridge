namespace Il2Cpp {
    export class Array<T extends Il2Cpp.Field.Type = Il2Cpp.Field.Type> extends NativeStruct implements Iterable<T> {
        /** Gets the Il2CppArray struct size, possibly equal to `Process.pointerSize * 4`. */
        @lazy
        static get headerSize(): number {
            return Il2Cpp.corlib.class("System.Array").instanceSize;
        }

        /** @internal Gets a pointer to the first element of the current array. */
        get elements(): Il2Cpp.Pointer<T> {
            const string = Il2Cpp.string("vfsfitvnm");
            const array = string.object.method<Il2Cpp.Object>("Split", 1).invoke(NULL);

            // prettier-ignore
            const offset = array.handle.offsetOf(_ => _.readPointer().equals(string.handle)) 
                ?? raise("couldn't find the elements offset in the native array struct");

            // prettier-ignore
            getter(Il2Cpp.Array.prototype, "elements", function (this: Il2Cpp.Array) {
                return new Il2Cpp.Pointer(this.handle.add(offset), this.elementType);
            }, lazy);

            return this.elements;
        }

        /** Gets the size of the object encompassed by the current array. */
        @lazy
        get elementSize(): number {
            return this.elementType.class.arrayElementSize;
        }

        /** Gets the type of the object encompassed by the current array. */
        @lazy
        get elementType(): Il2Cpp.Type {
            return this.object.class.type.class.baseType!;
        }

        /** Gets the total number of elements in all the dimensions of the current array. */
        @lazy
        get length(): number {
            return Il2Cpp.api.arrayGetLength(this);
        }

        /** Gets the encompassing object of the current array. */
        @lazy
        get object(): Il2Cpp.Object {
            return new Il2Cpp.Object(this);
        }

        /** Gets the element at the specified index of the current array. */
        get(index: number): T {
            if (index < 0 || index >= this.length) {
                raise(`cannot get element at index ${index} as the array length is ${this.length}`);
            }

            return this.elements.get(index);
        }

        /** Sets the element at the specified index of the current array. */
        set(index: number, value: T) {
            if (index < 0 || index >= this.length) {
                raise(`cannot set element at index ${index} as the array length is ${this.length}`);
            }

            this.elements.set(index, value);
        }

        /** */
        toString(): string {
            return this.isNull() ? "null" : `[${this.elements.read(this.length, 0)}]`;
        }

        /** Iterable. */
        *[Symbol.iterator](): IterableIterator<T> {
            for (let i = 0; i < this.length; i++) {
                yield this.elements.get(i);
            }
        }
    }

    /** Creates a new empty array of the given length. */
    export function array<T extends Il2Cpp.Field.Type>(klass: Il2Cpp.Class, length: number): Il2Cpp.Array<T>;

    /** Creates a new array with the given elements. */
    export function array<T extends Il2Cpp.Field.Type>(klass: Il2Cpp.Class, elements: T[]): Il2Cpp.Array<T>;

    /** @internal */
    export function array<T extends Il2Cpp.Field.Type>(klass: Il2Cpp.Class, lengthOrElements: number | T[]): Il2Cpp.Array<T> {
        const length = typeof lengthOrElements == "number" ? lengthOrElements : lengthOrElements.length;
        const array = new Il2Cpp.Array<T>(Il2Cpp.api.arrayNew(klass, length));

        if (globalThis.Array.isArray(lengthOrElements)) {
            array.elements.write(lengthOrElements);
        }

        return array;
    }
}
