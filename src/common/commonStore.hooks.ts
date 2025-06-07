import { useDispatch, useSelector, useStore } from "react-redux";
import { CommonDispatch, CommonStore, RootState } from "./store";


export const useCommonDispatch = useDispatch.withTypes<CommonDispatch>();
export const useCommonSelector = useSelector.withTypes<RootState>();
export const useCommonStore = useStore.withTypes<CommonStore>();