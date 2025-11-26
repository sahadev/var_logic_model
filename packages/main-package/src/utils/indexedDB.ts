/**
 * IndexedDB 工具类，用于存储图表数据记录
 */

const DB_NAME = "LiteGraphEditorDB";
const STORE_NAME = "graphRecords";
const DB_VERSION = 1;

export interface GraphRecord {
  id?: number;
  title: string;
  data: any;
  createdAt: number;
  updatedAt: number;
}

class IndexedDBManager {
  private db: IDBDatabase | null = null;

  /**
   * 打开数据库连接
   */
  async openDB(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error("打开数据库失败"));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, {
            keyPath: "id",
            autoIncrement: true,
          });
          objectStore.createIndex("createdAt", "createdAt", { unique: false });
          objectStore.createIndex("updatedAt", "updatedAt", { unique: false });
        }
      };
    });
  }

  /**
   * 添加记录
   */
  async addRecord(title: string, data: any): Promise<number> {
    const db = await this.openDB();
    const now = Date.now();
    const record: GraphRecord = {
      title,
      data,
      createdAt: now,
      updatedAt: now,
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.add(record);

      request.onsuccess = () => {
        resolve(request.result as number);
      };

      request.onerror = () => {
        reject(new Error("添加记录失败"));
      };
    });
  }

  /**
   * 获取所有记录
   */
  async getAllRecords(): Promise<GraphRecord[]> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        const records = request.result as GraphRecord[];
        // 按更新时间倒序排列
        records.sort((a, b) => b.updatedAt - a.updatedAt);
        resolve(records);
      };

      request.onerror = () => {
        reject(new Error("获取记录失败"));
      };
    });
  }

  /**
   * 根据 ID 获取记录
   */
  async getRecordById(id: number): Promise<GraphRecord | undefined> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error("获取记录失败"));
      };
    });
  }

  /**
   * 更新记录标题
   */
  async updateRecordTitle(id: number, title: string): Promise<void> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const objectStore = transaction.objectStore(STORE_NAME);
      const getRequest = objectStore.get(id);

      getRequest.onsuccess = () => {
        const record = getRequest.result;
        if (!record) {
          reject(new Error("记录不存在"));
          return;
        }

        record.title = title;
        record.updatedAt = Date.now();
        const updateRequest = objectStore.put(record);

        updateRequest.onsuccess = () => {
          resolve();
        };

        updateRequest.onerror = () => {
          reject(new Error("更新记录失败"));
        };
      };

      getRequest.onerror = () => {
        reject(new Error("获取记录失败"));
      };
    });
  }

  /**
   * 删除记录
   */
  async deleteRecord(id: number): Promise<void> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error("删除记录失败"));
      };
    });
  }
}

export const dbManager = new IndexedDBManager();

