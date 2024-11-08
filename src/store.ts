/* eslint-disable @typescript-eslint/ban-ts-comment */
import { create } from 'zustand';
import { UserStoreType, createUserStore } from './store/userStore';


export type masterInterface = UserStoreType ;

export const store = create<masterInterface>()((...props) => ({
  ...createUserStore(...props),
}));
