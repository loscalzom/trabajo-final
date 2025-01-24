const consultaDePrueba=async()=>{

    try {  
       const res = await fetch(
        ENVIROMENT.API_URL+"/api/status/ping",
        {
        method:"GET"
      })
      console.log(res)
      const data = await res.json()
      console.log(data)
    } 
    catch (error) {console.error ("Error al consular",error)
      
    }
  
  }