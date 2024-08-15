// import BackgroundFetch from "react-native-background-fetch";
import { useStore } from "./useStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LAST_RESET_DATE_KEY } from "./useStore";
const getData = () => {};
/* export const configureBackgroundFetch = () => {
  BackgroundFetch.configure(
    {
      minimumFetchInterval: 1440,
    },
    async (taskId) => {
      console.log("[backgoundFetch] fetching", taskId);

      const resetMonthlyData = useStore.getState().resetMonthlyData;
      const lastResetDate = await AsyncStorage.getItem(LAST_RESET_DATE_KEY);
      const now = new Date();
      if (
        !lastResetDate ||
        new Date(lastResetDate).getMonth() !== now.getMonth() ||
        new Date(lastResetDate).getFullYear() !== now.getFullYear()
      ) {
        await resetMonthlyData();
      }

      BackgroundFetch.finish(taskId);
    },
    (taskId) => {
      console.log("[BackgroundFetch] TIMEOUT taskId: ", taskId);
      BackgroundFetch.finish(taskId);
    }
  );

  // Optional: Query the authorization status.
  BackgroundFetch.status((status) => {
    switch (status) {
      case BackgroundFetch.STATUS_RESTRICTED:
        console.log("BackgroundFetch restricted");
        break;
      case BackgroundFetch.STATUS_DENIED:
        console.log("BackgroundFetch denied");
        break;
      case BackgroundFetch.STATUS_AVAILABLE:
        console.log("BackgroundFetch is enabled");
        break;
    }
  });
};
 */
//configureBackgroundFetch();
