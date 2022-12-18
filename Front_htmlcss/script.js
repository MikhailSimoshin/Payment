function nalogi () {
  //Добавление кода на страницу
  let modal = document.createElement("div");
  modal.classList.add("modal");
  document.body.append(modal);
  modal.insertAdjacentHTML("afterbegin", `
  <div class="modal-overlay">
    <div class="modal-window">
      <div class="modal-header">
        <span class="modal-title">Уплата налогов</span>
      </div>
      <div class="modal-body">
      </div>
      <div class="modal-footer">
        <button onclick="modal_cancel()" class="modal-cancel">Выйти</button>
      </div>
    </div>
  </div>`)

  //Уплачены/неуплачены (Если 1 => уплачены, иначе => неуплачены)
  //TODO_1: сделать в зависимости от значения на сервере вывод статуса налогов. В случае неуплаты при нажатии на "Уплатить"
  //значение на сервере изменится.
  let taxes = prompt("Вы уплатили налоги?");
  let modalTaxes = document.querySelector(".modal-body"),
    modalTaxesFooter = document.querySelector(".modal-footer");
  if (taxes == "1") {
    modalTaxes.insertAdjacentHTML("afterbegin", `<span class="modal-nalogi" style="background-color: #599d36">Налоги уплачены</span>`)
    modalTaxesFooter.insertAdjacentHTML("afterbegin", `<button type="submit" class="modal-submit" disabled>Упллатить</button>`)
  }
  else {
    modalTaxes.insertAdjacentHTML("afterbegin", `<span class="modal-nalogi" style="background-color: #fe5495">Налоги не уплачены</span>`)
    modalTaxesFooter.insertAdjacentHTML("afterbegin", `<button type="submit" class="modal-submit">Упллатить</button>`)
  }
}

function perevod () {
  //TODO_2: сделать выпадающее окошечко <datalist> у <input placeholder="Выберите игрока: ">, 
  //где будут имена игроков (<options>), получаемые с сервера.
  //Также уже можно заняться реализацией перевода манесов.
  let modal = document.createElement("div");
  modal.classList.add("modal");
  document.body.append(modal);
  modal.insertAdjacentHTML("afterbegin", `
  <div class="modal-overlay">
    <div class="modal-window">
      <div class="modal-header">
        <span class="modal-title">Перевод средств другому игроку</span>
      </div>
      <form id="transferForm" method="post">
        <div class="modal-body">
          <input id="input_1" autocomplete="off" list="player-list" type="text" maxlength="32" placeholder="Выберите игрока: " name="player-name" required>
          <input id="input_2" autocomplete="off" type="number" placeholder="Кол-во талиц: " name="money-amount" required>
        </div>
        <div class="modal-footer">
          <button onclick="pin_code()" type="button" class="modal-submit">Подтвердить</button>
          <button type="button" onclick="modal_cancel()" class="modal-cancel">Выйти</button>
        </div>
      </form>
    </div>
  </div>`)
}

function uslugi () {
  // TODO_3: Тут то же самое, что и во втором todo, но тут будут фирмы и услуги.
  let modal = document.createElement("div");
  modal.classList.add("modal");
  document.body.append(modal);
  modal.insertAdjacentHTML("afterbegin", `
  <div class="modal-overlay">
    <div class="modal-window">
      <div class="modal-header">
        <span class="modal-title">Оплата услуг фирмы</span>
      </div>
      <form id="serviceForm" method="post">
        <div class="modal-body">
          <input id="input_1" autocomplete="off" maxlength="32" placeholder="Выберите фирму: " name="firm-name" required>
          <input id="input_2" autocomplete="off" maxlength="32" placeholder="Выберите услугу: " name="service-name" required>
        </div>
        <div class="modal-footer">
          <button onclick="pin_code()" type="button" class="modal-submit">Подтвердить</button>
          <button type="button" onclick="modal_cancel()" class="modal-cancel">Выйти</button>
        </div>
      </form>  
    </div>
  </div>`)
}

function pin_code () { //Модальное окно с вводом пин-кода. 
  let inputForm1 = document.querySelector("#input_1").value,
    inputForm2 = document.querySelector("#input_2").value;
  if (inputForm1 == "" || inputForm2 == "") {
    alert("Введите что-нибудь")
  }
  else {  let pin_modal = document.createElement("div");
  pin_modal.classList.add("pin_modal");
  document.body.append(pin_modal);
  pin_modal.insertAdjacentHTML("afterbegin", `    
  <div class="modal-overlay">
    <div class="modal-window">
      <div class="modal-header">
        <span class="modal-title">Подтверждение действия</span>
      </div>
      <form id="pinForm" method="post">
        <div class="modal-body">
          <input id="pin-input" type="password" autocomplete="off" maxlength="6" placeholder="Введите ваш пин-код: " name="pin-code" required>
        </div>
        <div class="modal-footer">
          <button type="button" onclick="pin_code_verify()"  class="modal-submit">Подтвердить</button>
          <button type="button" onclick="modal_cancel()" class="modal-cancel">Выйти</button>
        </div>
      </form>
    </div>
  </div>`);}
}
function pin_code_verify () { //Подтверждение пин-кода.
  pinForm = document.querySelector("form")
  pinFormAt = pinForm.getAttribute("id");
  pinInput = document.getElementById("pin-input").value;
  //Тут надо запросы к серваку делать на подтверждение пин-кода, а не тот огрызок, который я сделал.
  if (pinInput == "228133" ) {
    pinForm.submit();
  }
  else {
    alert("Неправильно")
  }
}

function modal_cancel () { //Кнопка "Выйти" в модалках
  let modal_btn = document.querySelector(".modal-cancel").disabled = true;
  let modal = document.querySelector(".modal");
  let pin_modal = document.querySelector(".pin_modal");
  console.log(modal);
  console.log(pin_modal);

  let modal_animate = [
    {opacity: "1"},
    {opacity: "0"}
  ]

  if (modal != null && pin_modal != null) {
    modal.animate(modal_animate, {duration: 1000})
    pin_modal.animate(modal_animate, {duration: 1000})
    setTimeout(() => {  modal.remove(); pin_modal.remove() }, 970);
  }
  else {
    modal.animate(modal_animate, {duration: 1000})
    setTimeout(() => {  modal.remove();}, 970);
  }
}