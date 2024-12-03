import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getMethod, getMethodPostByToken, getMethodByToken} from '@services/Request';
import { formatMoney } from '@services/Formatmoney';
import 'react-toastify/dist/ReactToastify.css';

function DefaultLayout() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [visibleCount, setVisibleCount] = useState(4);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await getMethod(`${apiUrl}/api/product/public/find-all`);
                setProducts(result.content);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    const handleShowMore = () => {
        setVisibleCount(prevCount => Math.min(prevCount + 4, products.length));
    };


    async function initCart() {
        try {
          const response = await getMethodByToken(`${apiUrl}/api/cart/user/my-cart`);
          await response.json();
        } catch (error) {
          toast.error('Có lỗi xảy ra khi tải giỏ hàng.');
        }
      }

      async function updateCartItem(id, quantity) {
        try {
          const url = `${apiUrl}/api/cart/user/up-and-down-cart?id=${id}&quantity=${quantity}`;
          await getMethodByToken(url);
          await initCart();
        } catch (error) {
          toast.error('Có lỗi xảy ra khi cập nhật giỏ hàng.');
        }
      }

    const addToCart = async (product,newQuantity) => {
        try {
            const response = await getMethodByToken(`${apiUrl}/api/cart/user/my-cart`);
            const cartItems = await response.json();
            const existingItem = cartItems.find(item => item.product.id === product.id);
            if (existingItem) {
                updateCartItem(existingItem.id,newQuantity)
                alert("Số lượng sản phẩm đã được cập nhật trong giỏ hàng");
            } else {
                const url = `${apiUrl}/api/cart/user/create?idproduct=${product.id}`;
                const result = await getMethodPostByToken(url);
                if (newQuantity>1)
                {
                    newQuantity=newQuantity-1;
                    addToCart(product,newQuantity)
                }
                if (result.status < 300) {
                    alert("Thêm giỏ hàng thành công");
                } else {
                    alert("Hãy đăng nhập");
                }
            }
            const url2 = `${apiUrl}/api/cart/user/count-cart`;
            await getMethodByToken(url2);
        } catch (error) {
            console.error("Error adding product to cart:", error);
            toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
        }
    };


    return (
        <>
            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner h-100">
                    <div className="carousel-item h-100 active">
                        <img className="d-block h-100 w-100 object-fit-cover" src="./assets/banner1.jpg" alt="First slide" />
                    </div>
                    <div className="carousel-item h-100">
                        <img className="d-block h-100 w-100 object-fit-cover" src="./assets/banner2.jpg" alt="Second slide" />
                    </div>
                    <div className="carousel-item h-100">
                        <img className="d-block h-100 w-100 object-fit-cover" src="./assets/banner3.jpg" alt="Third slide" />
                    </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </a>
            </div>

            <div className="container my-5">
                <h2 className="text-center mb-4">Sản phẩm nổi bật</h2>
                <div className="row">
                    {products.slice(0, visibleCount).map(product => (
                        <div className="col-md-3 mb-4" key={product.id}>
                            <div
                                className="card h-100 d-flex flex-column align-items-center text-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/product?productId=${product.id}&productName=${product.name}`)}
                            >
                                <div
                                    className="d-flex mt-3 justify-content-center align-items-center w-100"
                                    style={{ height: '150px' }}
                                >
                                    <img
                                        src={product.imageBanner}
                                        className="card-img-top h-100 w-100"
                                        alt={product.name}
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>

                                <div className="card-body d-flex flex-column align-items-center">
                                    <h5 className="card-title">{product.name}</h5>
                                    <div className="card-text">
                                     <span style={{ fontWeight: 'normal' }}>
                                     {formatMoney(product.price)}
                                        </span>
                                    </div>
                                    <button
                                        className="btn btn-success mt-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(product,1);
                                        }}
                                    >
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {visibleCount < products.length && (
                    <div className="text-center mt-4">
                        <button className="btn btn-light" onClick={handleShowMore}>Xem thêm</button>
                    </div>
                )}
            </div>
        </>
    );
}

export default DefaultLayout;
