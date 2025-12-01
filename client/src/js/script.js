import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../scss/styles.scss"

import * as bootstrap from "bootstrap";
import "bootstrap"; // JS dio Bootstrapa
import { Modal } from "bootstrap";
import $ from "jquery";

// jQuery globalno (zadano u zadatku)
window.$ = $;
window.jQuery = $;

// ------- Helper funkcije -------

fetch("/api/todos")


// zadana prettyDate funkcija iz zadatka
const prettyDate = (dateStr) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short"
  });
  return formatter.format(new Date(dateStr));
};

// konverzija u string za datetime-local input
const toInputValue = (dateStr) => {
  const d = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

let editModal = null;       // globalna instanca Modal
let currentEditId = null;   // čuvamo id trenutno uređenog TODO-a

// ------- Dohvat TODO-a sa servera -------

function getTodos(callback) {
  fetch("http://localhost:3000/api/todos")
    .then((res) => res.json())
    .then((data) => {
      if (typeof callback === "function") {
        callback(data);
      }
    })
    .catch((err) => {
      console.error("Error fetching todos:", err);
    });
}

// ------- Renderiranje tablice -------

function renderTableRows(todos) {
  const tbody = document.getElementById("todo-tbody");

  const rowsHtml = todos
    .map(
      (todo) => `
      <tr>
        <td>${todo.description}</td>
        <td>${prettyDate(todo.date)}</td>
        <td class="text-center">
          <i class="bi ${
            todo.completed
              ? "bi-check-circle-fill text-success"
              : "bi-x-circle-fill text-danger"
          }"></i>
        </td>
        <td class="text-center modify-cell" data-id="${todo.id}">
          <i class="bi bi-pencil-square"></i>
        </td>
      </tr>
    `
    )
    .join("");

  tbody.innerHTML = rowsHtml;

  // jQuery event handler za Modify ćelije
  $(".modify-cell")
    .off("click")
    .on("click", function () {
      const id = $(this).data("id");
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        openEditModal(todo);
      }
    });
}

// ------- Modal funkcije -------

function openEditModal(todo) {
  currentEditId = todo.id;

  $("#todoDescription").val(todo.description);
  $("#todoDate").val(toInputValue(todo.date));
  $("#todoCompleted").prop("checked", todo.completed);
  $("#todoId").val(todo.id);

  editModal.show();
}

function hide() {
  if (editModal) {
    editModal.hide();
  }
}

// Submit (Save changes) – šalje PUT na server
function submit() {
  const id = $("#todoId").val() || currentEditId;
  const description = $("#todoDescription").val().trim();
  const dateInput = $("#todoDate").val();
  const completed = $("#todoCompleted").prop("checked");

  if (!id || !description || !dateInput) {
    alert("Please fill all required fields.");
    return;
  }

  const isoDate = new Date(dateInput).toISOString();

  const updatedTodo = {
    id,
    description,
    date: isoDate,
    completed
  };

  $.ajax({
    url: `http://localhost:3000/api/todos/${id}`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(updatedTodo),
    success: function () {
      // ponovno učitaj sve zapise
      getTodos(renderTableRows);
      hide();
    },
    error: function (err) {
      console.error("Error updating todo:", err);
      alert("Error updating TODO.");
    }
  });
}

// funkcije moraju biti globalne da bi ih HTML mogao vidjeti
window.hide = hide;
window.submit = submit;

// ------- Inicijalizacija kad je DOM spreman -------

document.addEventListener("DOMContentLoaded", () => {
  const modalElement = document.getElementById("editModal");
  editModal = new Modal(modalElement);

  // inicijalno učitavanje tablice
  getTodos(renderTableRows);
});
