//inicializando la DEXIE database
const db = new Dexie("Accounts App");
//creando la tabla de la database
db.version(2).stores({ accounts: "++id, account, user, pass" });

//inicializando referencias de la UI 
const form = document.querySelector("#new-task-form"); //opteniendo referencia del form y assignandolo a esta var
const _account = document.querySelector("#account"); //opteniendo referencia del input-account y assignandolo a esta var 
const _user = document.querySelector("#user"); //opteniendo referencia del  input-user y assignandolo a esta var 
const _pass = document.querySelector("#pass"); //opteniendo referencia del  input-pass y assignandolo a esta var
const list_el = document.querySelector("#tasks"); //opteniendo referencia del {div(id="tasks")} y assignandolo ala var
const btn = document.getElementById("btn");
const addBtn = document.getElementById("new-task-submit");
const newAcc = document.querySelector("#newAcc");
const btnEdit = document.querySelector("#btnEdit")
const editForm = document.querySelector("#editForm")
var idToEdit

form.onsubmit = async (event) => {
  event.preventDefault();
  newAcc.hidden = false;
  addBtn.hidden = true;
};

//evento onsubmit lansado cuando se presiona el button dentro del form 

btn.onclick = async (event) => {

  addBtn.hidden = false;
  if (_account.value == "" || _user.value == "" || pass.value == "") {
    alert("Cant be empty");
    // newAcc.reset();
    newAcc.hidden = true;
  } else {
    event.preventDefault();
    //optenemos los values de los inputs
    const account = _account.value;
    const user = _user.value;
    const pass = _pass.value;



    //esperamos que los valores de los inputs sean añadidos a la database
    await db.accounts.add([{ account: account, user: user, pass: pass }]);

    //llamamos y esperamos por la funcion que nos muestra las cuentas en la UI
    await getAccount();

    //limpiamos el form para añadir nueva cuenta

    newAcc.reset();
    newAcc.hidden = true;
  };

};

//funcion para mostrar tados que estan el la database
const getAccount = async () => {

  //leemos todos los datos de la database y lo organizamos de forma DESCENDENTE
  //luego los valores optenidos los conventimos en  una lista  y lo assignamos a la variable 
  const allAccounts = await db.accounts.reverse().toArray();
  //por cada elemento en la lista obtenida de la database insertamos un nuevo codigo HTML en {div(id="tasks")} 
  //con los valores correspondientes en la lista
  list_el.innerHTML = allAccounts
    .map(
      (data) => `
    <div class="task">
    <div class="content">
    <h1>${data[0].account}<h1>
    <input id="edit" class="text" readonly="readonly" type="text" value= ${data[0].user}>
    <input id="edit" class="text" readonly="readonly" type="text" value= ${data[0].pass}>    
    </div>
    <div class="actions">
    <div class="row">
    <button id="btnEdit" class="edit" onclick="editAccount(event, ${data.id})">EDIT</button>
    <br>
    <button class="delete" onclick="deleteAccount(event, ${data.id})">Delete</button>
    </div>
    </div>
    </div>
    `
    )
    .join("");
};
//cada vez que se inicie la app llamamos la funcion #getAccount
window.onload = getAccount;

//funcion para editar cuenta {resive un event y un id}

const editAccount = async (event, id) =>{
  editForm.hidden = false
  idToEdit = id
  values = await db.accounts.where('id').equals(id).toArray();
  document.querySelector("#accEdit").value = values[0][0].account;
  document.querySelector("#userEdit").value = values[0][0].user;
  document.querySelector("#passEdit").value = values[0][0].pass;


  editForm.onsubmit = async (event) =>{
    const acc = document.querySelector("#accEdit").value;
    const newUser = document.querySelector("#userEdit").value;
    const newPass = document.querySelector("#passEdit").value;

    await db.accounts.delete(idToEdit)

    await db.accounts.add([{ account: acc, user: newUser, pass: newPass }]);
    
    await getAccount();
    editForm.hidden = true;
  
  };

};

//funcion para eliminar una cuenta {resive un event y un id}
const deleteAccount = async (event, id) => {
  await db.accounts.delete(id);
  await getAccount();
};