import { create } from 'zustand'

export type ValueModifyEntity = {
    title: string;
    value: string;
    onCallback: (value: any) => void;
}

export type StateProps = {
    bears: number;
    currentEditEntity: ValueModifyEntity | null;
    onValueModify: (entity: ValueModifyEntity) => void;
}

export const useBearStore = create<StateProps>((set) => ({
    bears: 0,
    currentEditEntity: null,
    onValueModify: (entity: ValueModifyEntity) => {
        set((state) => {
            return { currentEditEntity: entity }
        })
    },
}))
