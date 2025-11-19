import { useEffect, useState } from "react"
import type { FakestoreContract } from "../../contracts/fakestore-contract";
import axios from "axios";

export function DataBinding()
{
    const [categories, setCategories] = useState<string[]>([]);
    const [products, setProducts] = useState<FakestoreContract[]>();

    function LoadCategories(){
        axios.get('https://fakestoreapi.com/products/categories')
        .then(response=>{
            setCategories(response.data);
        })
    }
    function LoadProducts(){
        axios.get('https://fakestoreapi.com/products')
        .then(response=>{
            setProducts(response.data);
        })
    }

    useEffect(()=>{
        LoadCategories();
        LoadProducts();
    },[])

    return(
        <div>
            <h2>Data Binding</h2>
            <select>
                {
                    categories.map(category=> <option key={category}>{category}</option>)
                }
            </select>
            <div>
                {
                    products?.map(product=> <img  key={product.id} src={product.image} width="50" height="50"/>)
                }
            </div>
        </div>
    )
}