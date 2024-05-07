var Category_image= document.getElementById("Category-image")
var Category_name = document.getElementById("Category-name")
// var modal1=document.getElementById("modal1")
var Add_btn= document.getElementById("Add_btn")
var Categories_data=document.getElementById("Categories-data")
var Category_edit_image=document.getElementById("Category_edit_image")
var dbref=firebase.database().ref("category")
let currentEditKey = ""
var check= false


var Category_image_url=""

Category_image.addEventListener("change",function(e){
//  console.log(e.target.files[0])
 image_uplod(e)

})
function image_uplod(e){
    var storageRef = firebase.storage().ref();
    var image_uploded= storageRef.child(`Category/${e.target.files[0].name}`).put(e.target.files[0]);
   image_uploded.on('state_change',
    (snapshot)=>{
        var progress=(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        Toastify({
            text: progress.toFixed(2) + "%",
                duration: 1000,
            style:{
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },            
            }).showToast();
        // console.log(progress)
    },
    (error)=>{
        Toastify({

            text: error,
            
            duration: 2000
            
            }).showToast();
    },
    ()=>{
        image_uploded.snapshot.ref.getDownloadURL().then((url)=>{
            Category_image_url=url
            Add_btn.disabled=false
            Category_edit_image.src=Category_image_url
            // console.log('File available at', url);
        });
}
)
}

async function addCategory(){
    Add_btn.disabled=true
    
    var response=validateData()
    if(response){
        if(check==false){
            var addCategory_key=dbref.push().getKey()
            // console.log(addCategory_key)
            
            var Category_data={
                    Category_name:Category_name.value,
                    Category_image:Category_image_url,
                    Category_key:addCategory_key,        
                }
                await dbref.child(addCategory_key).set(Category_data);
               
                    var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal'));
                    myModal.hide();
            
                    Toastify({
                        text: "New Category added",
                    duration: 2000,
                    style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                    }).showToast();
    
            }
        else{
            // console.log("edit function hit")
            EditCategoryApi();
        //     Toastify({
        //         text: "update Category",
        //        duration: 2000,
        //        style: {
        //   background: "linear-gradient(to right, #00b09b, #96c93d)",
        // },
        //     }).showToast();
    
        }
        
        view_Category_in_Table();
        
        Add_btn.disabled=true
       Category_name.value="";
       Category_image.value = "";
    
    }
    
    else{
        Add_btn.disabled=false

        Toastify({
            text: "Enter correct data",
           duration: 2000,
           style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
        }).showToast();
    }
    
}

function view_Category_in_Table(){
    Categories_data.innerHTML=""
    dbref.get()
    .then((snapshot)=>{
        // console.log(snapshot.val())
        if(snapshot.val()!=undefined || snapshot.val()!=null){
            var Categories_data_value=Object.values(snapshot.val())
            // console.log(Categories_data_value)
            for (i in Categories_data_value){
                // console.log(i)
                Categories_data.innerHTML +=`
                <div class="item1">
                <h3 class="tr-td tr-td-No">${(Number(i)+1)}</h3>
                <h3 class="tr-td tr-td-Name">${Categories_data_value[i]["Category_name"]}</h3>
                <div class= "tr-td-image">
                <img class="Category_image" src="${Categories_data_value[i]["Category_image"]}">
                </div>
                                <div class="action-buttons">
                                <img class="action-btn" src="../../images/icons/icons8-edit-30.png" data-bs-toggle="modal"
                                data-bs-target="#exampleModal" onclick="editfunctionText(this)" id='${Categories_data_value[i]["Category_key"]}'>
                                <img class="action-btn" src="../../images/icons/icons8-delete-30.png" id='${Categories_data_value[i]["Category_key"]}' onclick="delete_Category(this)">
                                </div>
                                </div>
                                `
            }
        }
    })
}

function editfunctionText(e){
    // console.log(e)
    Add_btn.innerHTML="Save Changes"
    Category_name.value=e.parentNode.parentNode.childNodes[3].innerText
    Category_edit_image.src=e.parentNode.parentNode.childNodes[5].childNodes[1].src
    // console.log(e.parentNode.parentNode.childNodes) 
    Category_edit_image.style.display="inline" 
    Category_edit_image.style.height="110px" 
    Category_image_url=e.parentNode.parentNode.childNodes[5].childNodes[1].src
    check=true     
    currentEditKey=e.id
    Add_btn.disabled=false
    
}

function add_Category_function(){
    Add_btn.innerHTML="Add Category"
    Category_name.value=""
    Category_image_url=""
    check=false  
    Category_edit_image.style.display="none"
    Add_btn.disabled=true
}

function delete_Category(deletebtn_key){
    // console.log(deletebtn_key.parentNode.parentNode)
    deletebtn_key.parentNode.parentNode.remove()
    dbref.child(deletebtn_key.id).remove()

}

async function EditCategoryApi(){
    // console.log(currentEditKey)
    var updateobject={
        Category_name:Category_name.value,
        Category_image:Category_image_url,

    }
    console.log(updateobject)
    await dbref.child(currentEditKey).update(updateobject)
    Toastify({
        text: "edit Category",
       duration: 2000,
       style: {
  background: "linear-gradient(to right, #00b09b, #96c93d)",
},
    }).showToast();
    var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal'));
    myModal.hide();
}


function validateData(){
    if(Category_name.value!="" && Category_image_url!=""){
        return true
    }
    else{
        return false
    }
}



view_Category_in_Table()




