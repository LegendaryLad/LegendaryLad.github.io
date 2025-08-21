const entryTokens = {
  "-1": ["test"],
};

function hasValidToken(ref, token) {
  return entryTokens[ref] && entryTokens[ref].includes(token);
}
