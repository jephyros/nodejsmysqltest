"use strict";
const db = require('./pool');
//aws lambda ?

    try {
        await conn.beginTransaction() // 트랜잭션 적용 시작

        const select1 = await conn.query("select ps_id from table1 where ci_status=? and ci_type =? and deviceid=? and ci_code=?",params)
        
        
        
        
        if (select1[0].length == 1) {
            const ps_id =select1[0][0].ps_id
            //임시(테스트를위해 상태값 과  변경안함)
            const update1 = await conn.query("update table2 set ci_complete_date = now() where ci_status =? and ci_type =? and deviceid=? and ci_code=?",params)
            const update2 = await conn.query("update table3 set installdate = now() where ps_id =?", [ps_id])
            //실제적용 
            //const update1 = await conn.query("update cl_task_install set ci_complete_date = now(),ci_status ='CST02' where ci_status =? and ci_type =? and deviceid=? and ci_code=?",params)
            //const update2 = await conn.query("update bs_position set installdate = now(), deviceid='?' where ps_id =?", [deviceid,ps_id])
            
            
            if (update1[0].affectedRows == 1 && update2[0].affectedRows == 1){
                await conn.commit() // 커밋
                
                response ={
                        "res_code":"s000",
                        "res_time":curtimestamp,
                        "request_trid":event_trid
                }
            }else{
                conn.rollback()
                response = {
                    "res_code":"f999",
                    "res_time":curtimestamp,
                    "request_trid":event_trid,
                    "message":"DB Process error1"
                    
                }
            }
        }else{
            conn.rollback()
                response = {
                    "res_code":"f999",
                    "res_time":curtimestamp,
                    "request_trid":event_trid,
                    "message":"Collect task is not exists."
                    
                }
        }

        
    } catch (err) {
        console.log(err)
        conn.rollback()
        
        response = {
                "res_code":"f999",
                "res_time":curtimestamp,
                "request_trid":event_trid,
                "message":"query error"
                
            }
    
        
    } finally {
        conn.release() // pool에 connection 반납
        callback(null,response);
    }
    


// }    