import Model from "./Model";

class System extends Model{
  getSystemInfo(){
    return new Promise(async (resolve, reject) => {
      try{
        let result = await this.request("GET", "/System/info");
        resolve(result);
      }
      catch (e){
        reject(e);
      }
    });
  }
  /**
   * 获得所有日志
   * @returns {Promise<any>}
   */
  getAllLogs(){
    return new Promise(async (resolve, reject) => {
      try{
        let result = await this.request("GET", "/System/logs");
        resolve(result);
      }
      catch (e){
        reject(e);
      }
    });
  }
}

export default new System();
