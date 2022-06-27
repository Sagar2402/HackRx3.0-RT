import React from "react";
import "./DelegateCard.scss";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
const DelegateCard = ({
  displayRazorpay,
  data,
  isMahe,
  cashPay,
  isBought,
  userID,
}) => {
  const [bought, setBought] = useState(isBought);
  const auth = useAuth();
  const cardPrice = data.price;
  return (
    cardPrice >= 0 && (
      <div
        className={
          data.isActive
            ? `del-card card-up m-1 ${data.type.toLowerCase()} font-medium`
            : `del-card card-up m-1 ${data.type.toLowerCase()} font-medium not-active`
        }
      >
        <div className="del-content">
          <div>
            <p className="del-type">{data.type}</p>
            <h1 className="text-white">
              {data.name}
              {bought === 1 ? (
                <span style={{ color: "white" }}>
                  <i className="fa fa-check-circle mx-2"></i>
                </span>
              ) : (
                bought === 2 && (
                  <span style={{ color: "white" }}>
                    <i className="fa fa-clock-o mx-2"></i>
                  </span>
                )
              )}
            </h1>
          </div>
          <div className="blank"></div>
          <div className={`price ${bought && "bought"}`}>
            {
              <div className="clg px-1">
                {cardPrice === 0 ? <p>FREE</p> : <p>&#x20B9;{cardPrice}</p>}
                {bought === 1 ? (
                  <button style={{ color: "black" }} disabled={true}>
                    Purchased
                  </button>
                ) : bought === 2 && cardPrice !== 0 ? (
                  <>
                    <button style={{ color: "black" }} disabled={true}>
                      Pay via cash at the nearest Infodesk
                    </button>
                    <button
                      style={{ color: "black" }}
                      disabled={data.isActive ? false : true}
                      onClick={() =>
                        displayRazorpay(data._id, cardPrice, auth.user)
                      }
                    >
                      Pay Online
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      style={{ color: "black" }}
                      disabled={true}
                      onClick={async () => {
                        const d = await cashPay(data._id, cardPrice);
                        if (d.status === 200 && cardPrice === 0) setBought(1);
                        else if (d.status === 200) setBought(2);
                      }}
                    >
                      {cardPrice === 0 ? "Buy Now" : "Pay via Cash[Closed]"}
                    </button>{" "}
                    {cardPrice !== 0 && (
                      <button
                        style={{ color: "black" }}
                        disabled={data.isActive ? bought : true}
                        onClick={() =>
                          displayRazorpay(data._id, cardPrice, auth.user)
                        }
                      >
                        Pay Online
                      </button>
                    )}
                  </>
                )}
              </div>
            }
          </div>
          <div className="blank"></div>
        </div>
      </div>
    )
  );
};

export default DelegateCard;
