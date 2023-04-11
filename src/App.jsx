import axios from "axios";
import { useEffect, useState } from "react";
import { SearchIcon } from "./icons/iconsForInput";
function App() {
  const [products, setProducts] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [offsetPage, setOffsetPage] = useState(0);

  const handleSearchedProduct = async () => {
    setLoading(true);
    if (inputValue === "") {
      handleFetchOffset();
      setLoading(false);
      return;
    }
    const res = await axios.get(
      `https://dummyjson.com/products/search?q=${inputValue}&limit=10`
    );
    if (res.status === 200 && res.data.products.length !== 0) {
      setProducts(res.data.products);
      console.log(res);
    } else {
      setProducts([]);
      console.log(products);
    }
    setLoading(false);
  };

  const handleOffsetPage = (index) => {
    setOffsetPage((prev) => {
      const result = prev + index;
      if (result < 0) {
        return 0;
      } else if (result > 9) {
        return 9;
      }
      return result;
    });
  };
  const handleFetchOffset = async () => {
    const res = await axios.get(
      `https://dummyjson.com/products?limit=10&skip=${offsetPage * 10}`
    );
    if (res.status === 200 && res.status.products?.length !== 0) {
      setProducts(res.data.products);
      console.log(res);
    }
  };
  useEffect(() => {
    const interval = setTimeout(() => {
      handleSearchedProduct();
    }, 800);
    return () => clearTimeout(interval);
  }, [inputValue]);

  useEffect(() => {
    const interval = setTimeout(() => {
      handleFetchOffset();
    }, 500);
    return () => clearTimeout(interval);
  }, [offsetPage]);
  return (
    <div>
      <div>
        <input
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          type="text"
          value={inputValue}
          className="results"
        />
        <SearchIcon />
      </div>
      <button onClick={() => handleOffsetPage(1)}>Nex page ...</button>
      <button onClick={() => handleOffsetPage(-1)}>Prev page ...</button>
      <span
        style={{
          backgroundColor: "lightgreen",
          padding: "10px",
          marginRight: "10px",
          color: "#fff",
        }}
      >
        {offsetPage + 1}
      </span>
      <div>
        {loading ? (
          <span>Loading ... </span>
        ) : (
          <>
            <ul>
              {products.length ? (
                products.map((product, index) => (
                  <li key={"product" + index}>
                    <h2>{product.title}</h2>
                  </li>
                ))
              ) : (
                <div>There is no products</div>
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
