(function () {
    // This code exists to support functionality in LocalVehicleStore.cs. It provides convenient access to
    // the browser's IndexedDB APIs, along with a preconfigured database structure.

    const db = idb.openDB('DoZen', 1, {
        upgrade(db) {
            db.createObjectStore('metadata');
            db.createObjectStore('NewsItems');
          
        },
    });

    window.localDoZenStore = {
        get: async (storeName, key) => (await db).transaction(storeName).store.get(key),
        getAll: async (storeName) => (await db).transaction(storeName).store.getAll(),
        getFirstFromIndex: async (storeName, indexName, direction) => {
            const cursor = await (await db).transaction(storeName).store.index(indexName).openCursor(null, direction);
            return (cursor && cursor.value) || null;
        },
        put: async (storeName, key, value) => {
            console.log("entered JS Put");
            (await db).transaction(storeName, 'readwrite').store.put(value, key === null ? undefined : key);
        },
        putAllFromJson: async (storeName, json) => {
            const store = (await db).transaction(storeName, 'readwrite').store;
            JSON.parse(json).forEach(item => store.put(item));
        },
        delete: async (storeName, key) => {
            console.log("Trying to delete");
            (await db).transaction(storeName, 'readwrite').store.delete(key);
        }
        ,
        autocompleteKeys: async (storeName, text, maxResults) => {
            const results = [];
            let cursor = await (await db).transaction(storeName).store.openCursor(IDBKeyRange.bound(text, text + '\uffff'));
            while (cursor && results.length < maxResults) {
                results.push(cursor.key);
                cursor = await cursor.continue();
            }
            return results;
        }
    };


    window.sessionDoZenStorage = {

        setItem: (key, data) => {
            window.localStorage.setItem(key, data);
        },
        getItem: (key) => {
            return window.localStorage.getItem(key);
        },
        removeItem: (key) => {
            window.localStorage.removeItem(key);
        },
        clear: () => {
            window.localStorage.clear();
        },
        length: () => {
            return window.localStorage.length;
        },
        key: (index) => {
            return window.localStorage.key(index);
        }

       
    };
})();