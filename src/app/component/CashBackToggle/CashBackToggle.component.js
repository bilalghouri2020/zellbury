// import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Skeleton from '@material-ui/lab/Skeleton';
import "./CashBackToggle.style";

import giftCardPNG from "../../../public/assets/images/gift-card.png"
import numberWithCommas from "../../util/NumberWithCommas";
import Switch from '@material-ui/core/Switch';
import UAParser from "ua-parser-js"
import { withStyles } from '@material-ui/core/styles';
import { useEffect } from "react";
import { isSignedIn } from 'Util/Auth';
import history from 'Util/History';

const CustomeSwitch = withStyles({
  switchBase: {
    color: "#949494",
    '&$checked': {
      // color: "#FF3665",
      // color: 
    },
    '&$checked + $track': {
      // backgroundColor: "#f393aa",
    },
  },
  checked: {},
  track: {
    opacity: 0.2
  },
})(Switch);

export default function LoyaltyCashBackToggle(props) {
  const { state, handleLoyaltyToggle, loyaltyPoints, isLoading , toggle} = props;

  const handleChange = (event) => {
    if (!isSignedIn()) {
      history.push({ pathname: '/my-account' });
      handleLoyaltyToggle(true)
      return false
    }
    handleLoyaltyToggle(event.target.checked);
    const parser = new UAParser();
    const { os: { name } } = parser.getResult();
    if (name !== "iOS" && name !== "Mac OS") {
      navigator.vibrate([300]);
    }
  };

  useEffect(() => {
    if (!isSignedIn()) {
      handleLoyaltyToggle(false);
    }
  }, [])

  return (
    <Card className="root">
      <CardContent className="card-content">
        <div className={"card_container"}>
          <div className={"card_container_1"}>
            <img src={giftCardPNG} />
            <div>
              <Typography className={"title"}>
                <b>LOYALTY CREDIT</b>
              </Typography>
              <Typography className={"pos"} color="textSecondary">
                Use Loyalty Credit first
              </Typography>
            </div>
          </div>
          <div className={"card_container_2"}>
            {isLoading ? <Skeleton width="50px" animation="wave" />
            :
             <Typography
              className={"price_text"}>
              Rs {numberWithCommas(loyaltyPoints)}
            </Typography>
          }
            <CustomeSwitch
              checked={state}
              onChange={handleChange}
              name="checkedA"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}