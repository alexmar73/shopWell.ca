const users=
{
    fakeDB:[],

    pushUser(obj)
    {

        this.fakeDB.push(obj);

       
    },

    findUser(username, password)
    {
        //console.log("inside find, user : " + username + " , pwd : " + password);
        
        var result = this.fakeDB.filter(function(v, i) {
            return (v.username == username && v.password == password);
          });
         
        //console.log(result);

        return result;
    },


    getAllUsers()
    {

        return this.fakeDB;
    },


}


module.exports=users;