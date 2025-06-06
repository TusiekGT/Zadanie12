import './style.css'
import { format } from 'date-fns';

const API_URL = 'https://czwzxjwyexkvpvlvyfwg.supabase.co/rest/v1/article?select=*';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3p4and5ZXhrdnB2bHZ5ZndnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNTM2NzQsImV4cCI6MjA2MzkyOTY3NH0.39p_AC5FPNeuaL0bmrzU-nFTtaAsYaFOdDSqF1Dn1Sc';

const response = fetch(API_URL, {
  headers: {
    apiKey: API_KEY,
  },
 });
 console.log(response)

const fetchArticles = async (order = 'created_at.desc') => {
  console.log("fetchArticles order:", order);
  try {
    const response = await fetch(`${API_URL}&order=${order}`, {
      headers: {
        apikey: API_KEY,
      },
    });
    const data = await response.json();
    console.log(data);

    const oldContainer = document.querySelector('#container_displayArticles');
    if (oldContainer) oldContainer.remove();

    displayArticles(data);
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const displayArticles = (articles) => {
  const container = document.createElement('div');
  container.id = 'container_displayArticles';

  articles.forEach((article) => {
    const articleDiv = document.createElement('div');
    articleDiv.innerHTML = `
      <h2 class="text-xl font-bold">${article.title}</h2>
      <h3 class="text-md italic">${article.subtitle}</h3>
      <p class="text-sm">Autor: ${article.author} Data: ${format(new Date(article.created_at), 'dd-MM-yyyy')}</p>
      <p>${article.content}</p>
    `;
    container.appendChild(articleDiv);
  });

  document.querySelector('#app').appendChild(container);
};

const createArticleForm = () => {
  const form = document.createElement('form');
  form.innerHTML = `
    <h2 class="text-xl font-bold">Dodaj nowy artykuł</h2>
    <input type="text" name="title" placeholder="Tytuł" class="w-full border" required />
    <input type="text" name="subtitle" placeholder="Podtytuł" class="w-full border" required />
    <input type="text" name="author" placeholder="Autor" class="w-full border" required />
    <textarea name="content" placeholder="Treść" class="w-full border" rows="4" required></textarea>
    <input type="date" name="created_at" class="w-full border" required />
    <button type="submit" class="text-md border">Dodaj artykuł</button>
  `;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { title, subtitle, author, content, created_at } = Object.fromEntries(new FormData(form));
    await createNewArticle({ title, subtitle, author, content, created_at });
    form.reset();
    document.querySelector('#app').innerHTML = document.querySelector('#app').innerHTML;
    fetchArticles();
  });

  document.querySelector('#app').appendChild(form);
};

const createNewArticle = async ({ title, subtitle, author, content, created_at }) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        apikey: API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        subtitle,
        author,
        content,
        created_at: new Date(created_at).toISOString(),
      }),
    });

    if (response.status !== 201) {
      throw new Error(`Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const createSortSelect = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <label for="sortSelect"">Sortuj:</label>
    <select id="sortSelect" class="border">
      <option value="created_at.asc">po dacie rosnąco</option>
      <option value="created_at.desc" selected>po dacie malejąco</option>
      <option value="title.asc">po nazwie alfabetycznie</option>
    </select>
  `;

  container.querySelector('#sortSelect').addEventListener('change', (e) => {
    fetchArticles(e.target.value);
  });

  const app = document.querySelector('#app');
  app.insertBefore(container, app.secondChild);
};

createArticleForm();
createSortSelect();
fetchArticles();


