function getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name) || '';
}

function loadSubmissions() {
    try {
        return JSON.parse(localStorage.getItem('ledgerStories') || '{}');
    } catch (e) {
        return {};
    }
}

function saveSubmissions(obj) {
    localStorage.setItem('ledgerStories', JSON.stringify(obj));
}

const GITHUB_CONFIG = {
    owner: 'LegendaryLad',
    repo: 'LegendaryLad.github.io',
    path: 'SearchLedger/ledger-submissions.json',
    branch: 'main',
    token: ''
};

async function uploadSubmission(entryId, text, timestamp) {
    const { owner, repo, path, branch, token } = GITHUB_CONFIG;
    const headers = { 'Accept': 'application/vnd.github+json' };
    if (token) headers['Authorization'] = `token ${token}`;

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    let dataArr = [];
    let sha;
    try {
        const resp = await fetch(apiUrl, { headers });
        if (resp.ok) {
            const data = await resp.json();
            sha = data.sha;
            dataArr = JSON.parse(atob(data.content));
        }
    } catch (e) {
        // start with empty array
    }

    dataArr.push([entryId, text, timestamp]);

    const body = {
        message: `Add submission for ${entryId}`,
        content: btoa(JSON.stringify(dataArr, null, 2)),
        sha,
        branch
    };

    try {
        await fetch(apiUrl, {
            method: 'PUT',
            headers,
            body: JSON.stringify(body)
        });
    } catch (e) {
        console.error('Failed to upload submission', e);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const entryId = getParam('id');
    const title = getParam('title');
    const header = document.getElementById('entryHeader');
    header.textContent = `${entryId}. ${title}`;

    document.getElementById('submitStory').addEventListener('click', async () => {
        const text = document.getElementById('storyInput').value.trim();
        if (!text) return;

        const store = loadSubmissions();
        if (!store[entryId]) store[entryId] = [];
        store[entryId].push(text);
        saveSubmissions(store);

        const date = new Date();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yyyy = date.getFullYear();
        const timestamp = `${mm}/${dd}/${yyyy}`;
        await uploadSubmission(entryId, text, timestamp);
        window.location.href = 'index.html';
    });
});
