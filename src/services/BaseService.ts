// src/services/BaseService.ts
export default abstract class BaseService<T> {
    constructor(
        public repository: any
    ) { }

    findAll() {
        return this.repository.findAll();
    }

    findById(id: string) {
        return this.repository.findById(id);
    }

    create(entity: T) {
        return this.repository.create(entity);
    }

    update(id: string, data: Partial<T>) {
        this.repository.update(id, data);
    }

    delete(id: string) {
        return this.repository.delete(id);
    }
}
