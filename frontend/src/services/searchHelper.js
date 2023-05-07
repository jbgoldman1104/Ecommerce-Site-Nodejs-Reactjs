const handleChange = (searchInput, data, setSearchResults) => {
  const newProductList = data.filter((product) => {
    return Object.values(product)
      .join(" ")
      .toLowerCase()
      .includes(searchInput.toLowerCase());
  });
  setSearchResults(newProductList);
};

export default handleChange;
