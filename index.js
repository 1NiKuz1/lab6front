const users = document.getElementById("users");
const result = document.getElementById("result");
const marvel = document.getElementById("marvel");
const posts = document.getElementById("posts");
const modal = document.getElementById("modal");

document.getElementById("modal_button").onclick = () => {
  modal.classList.add("character-modal--hide");
};

async function getPosts() {
  try {
    html = "<h1>Посты</h1>";
    result.innerHTML = html;
    let promise = await fetch("http://fetch/posts.php");
    let resPosts = await promise.json();
    console.log(resPosts);
    for (let item of resPosts) {
      html += `<li><a href="#" id="${item.id}" user_id="${item.user_id}" rel="posts">${item.title}</a></li>`;
    }
    result.innerHTML = html;
    document.querySelectorAll("[rel=posts]").forEach((el) => {
      el.onclick = async () => {
        result.innerHTML = "";
        let id = el.id;
        let user_id = el.getAttribute("user_id");
        let post = resPosts.find((item) => item.id == id);

        let promise = await fetch("http://fetch/users.php");
        let res = await promise.json();
        console.log(res);
        let user = res.find((item) => item.id == user_id);

        promise = await fetch("http://fetch/comments.php");
        res = await promise.json();
        console.log(res);
        let comments = res.filter((item) => item.post_id == id);

        let content = `<h2>${post.title}</h2>
        <p>${post.body}</p>
        <p>Автор поста: ${user.name}</p>
        `;
        for (let item of comments) {
          content += `<h3>Автор комментария: ${item.name}</h3>
          <p>Комментарий: ${item.body}</p>`;
        }
        result.innerHTML = content;
      };
    });
  } catch (e) {
    console.log(e.stack);
    html = "<h3>Во время выполнения асинхронного запроса возникла ошибка!</h3>";
    html += "Сервер вернул сообщение: " + e.message;
    result.innerHTML = html;
  }
}

async function loadCharacter(id) {
  const characterName = document.getElementById("character_name");
  const characterModified = document.getElementById("character_modified");
  const characterThumbnail = document.getElementById("character_thumbnail");
  const characterDescription = document.getElementById("character_description");
  const res = await fetch(
    `http://gateway.marvel.com:80/v1/public/characters/${id}?apikey=786775efc1eb6c7efdca4d54c25c9ef5`
  );
  const json = await res.json();
  modal.classList.remove("character-modal--hide");
  //console.log(json.data.results);
  characterName.innerHTML = json.data.results[0].name;
  characterModified.innerHTML = json.data.results[0].modified;
  characterDescription.innerHTML = json.data.results[0].description;
  characterThumbnail.setAttribute(
    "src",
    `${json.data.results[0].thumbnail.path}.${json.data.results[0].thumbnail.extension}`
  );
}

async function loadMarvel() {
  result.innerHTML = "";
  const res = await fetch(
    "http://gateway.marvel.com:80/v1/public/characters?apikey=786775efc1eb6c7efdca4d54c25c9ef5"
  );
  const json = await res.json();
  console.log(json.data.results);
  for (let chatacter of json.data.results)
    result.innerHTML += `<p id="${chatacter.id}">${chatacter.name}</p>
      <img id="thumbnail" src="${chatacter.thumbnail.path}.${chatacter.thumbnail.extension}" alt="thumbnail" />
			<button onclick="loadCharacter(${chatacter.id})">Перейти</button>`;
}

async function loadUsers() {
  result.innerHTML = "";
  const res = await fetch("https://reqres.in/api/users");
  const json = await res.json();
  for (let user of json.data)
    result.innerHTML += `<a href="#" id="${user.id}" rel="users" style="display: block">${user.first_name}</a>`;
  document.querySelectorAll("[rel=users]").forEach((el) => {
    el.addEventListener("click", async (e) => {
      result.innerHTML = "";
      const res = await fetch(
        "https://reqres.in/api/users/" + e.target.getAttribute("id")
      );
      const json = await res.json();
      result.innerHTML = `<p id="first_name">${json.data.first_name}</p>
      <p id="last_name">${json.data.last_name}</p>
      <p id="email">${json.data.email}</p>
      <img id="avatar" src="${json.data.avatar}" alt="Avatar" />`;
    });
  });
}

function loadListPainters() {
  let paintetsList = document.getElementById("paintets_list");
  let xhr = new XMLHttpRequest();
  xhr.open("get", "ajax/painters.json");
  xhr.send();
  xhr.responseType = "json";
  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let painters = xhr.response;

      for (let [key, value] of Object.entries(painters)) {
        let li = `<li><a href="#" id="${key}" rel="painters">${value.surname}</a></li>`;
        paintetsList.innerHTML += li;
      }
    }
    if (xhr.status === 404) {
      console.log("JSON не найден");
    }
  };
}

loadListPainters();

function fnLoadContent() {
  let id = this.id === undefined ? "main" : this.id;
  let url = "ajax/" + id + ".html";

  request = new XMLHttpRequest();
  request.open("get", url);
  request.send();
  request.onload = function () {
    if (request.status === 200) {
      result.innerHTML = request.response;
    }
    if (request.status === 404) {
      let msg = `
				<h1>К сожалению ресурс не найден</h1>
				<h3>Мы в курсе возникшей проблемы</h3>
				<h3>Поверьте, наши специалисты уже выехали на объекты и трудятся над устранением возможных неполадок</h3>
			`;
      result.innerHTML = msg;
    }
  };
}

function fnMyScript() {
  fnLoadContent("main");
  document.querySelectorAll("[rel=menu]").forEach((el) => {
    el.addEventListener("click", fnLoadContent);
  });

  users.onclick = () => {
    loadUsers();
  };

  marvel.onclick = () => {
    loadMarvel();
  };

  posts.onclick = () => {
    getPosts();
  };

  document.querySelectorAll("[rel=painters]").forEach((el) => {
    el.addEventListener("click", () => {
      let xhr = new XMLHttpRequest();
      xhr.open("get", "ajax/painters.json");
      xhr.send();
      xhr.responseType = "json";
      xhr.onload = function () {
        let id = el.id;
        if (xhr.readyState === 4 && xhr.status === 200) {
          let painters = xhr.response;

          for (let key of Object.entries(painters)) {
            if (key[0] == id) var painter = key[1];
          }

          let person = `
						<div>
						<h2>Художники</h2>
						<hr style="border-color: #909090;">
						<h2>${painter.surname} ${painter.name} ${painter.patronymic}</h2>
						<h3>Страна: ${painter.country}</h3>
						<h3>Родился: ${painter.yearBirth}</h3>
						<h3>Умер: ${painter.yearDeath}</h3>
						</div>
					`;
          let pict = "";

          for (let arrPainters of painter.painting) {
            pict += `
							<table style='margin-bottom: 50px;'><tr >
								<td style="vertical-align: top"><img src="${arrPainters[1]}" width="350px"></td>
								<td style="vertical-align: top; padding:0px 10px">
									<h2>${arrPainters[0]}</h2>
									<b>Год:</b> ${arrPainters[2]}<br />
									<b>Музей:</b> ${arrPainters[3]}<br />
									<b>Описание:</b><br />
									${arrPainters[4]}<br />
								</td>
							</tr></table>
						`;
          }
          result.innerHTML = person + pict;
        }
        if (request.status === 404) {
          let msg = `
						<h1>К сожалению ресурс не найден</h1>
						<h3>Мы в курсе возникшей проблемы</h3>
						<h3>Поверьте, наши специалисты уже выехали на объекты и трудятся над устранением возможных неполадок</h3>
					`;
          result.innerHTML = msg;
        }
      };
    });
  });
}
