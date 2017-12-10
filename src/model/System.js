import Model from "./Model";

class System extends Model{
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
