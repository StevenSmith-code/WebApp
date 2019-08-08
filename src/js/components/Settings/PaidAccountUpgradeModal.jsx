import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { withStyles, withTheme, OutlinedInput } from '@material-ui/core';
import { renderLog } from '../../utils/logging';
import { hasIPhoneNotch, isIOS } from '../../utils/cordovaUtils';
import Pricing from '../../routes/More/Pricing';

class PaidAccountUpgradeModal extends Component {
  // This modal will show a users ballot guides from previous and current elections.

  static propTypes = {
    classes: PropTypes.object,
    initialPricingPlan: PropTypes.string,
    pathname: PropTypes.string,
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      pathname: undefined,
      paidAccountProcessStep: '',
      radioGroupValue: 'annualPlanRadio',
      couponCodeInputValue: '',
      couponCodesFromAPI: [],
      isCouponApplied: false,
      couponDiscountValue: 0,
    };

    this.closePaidAccountUpgradeModal = this.closePaidAccountUpgradeModal.bind(this);
    this.onCouponInputChange = this.onCouponInputChange.bind(this);
    this.checkCouponCodeValidity = this.checkCouponCodeValidity.bind(this);
    this.backToChoosePlan = this.backToChoosePlan.bind(this);
    this.resetCouponCode = this.resetCouponCode.bind(this);
  }

  componentDidMount () {
    this.setState({
      pathname: this.props.pathname,
      // Test coupon codes to simulate having multiple promotions running at the same time
      couponCodesFromAPI: [
        {
          code: '10OFF',
          discount: 10,
        },
        {
          code: '25OFF',
          discount: 25,
        },
        {
          code: '50OFF',
          discount: 50,
        },
      ],
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      pathname: nextProps.pathname,
    });
  }

  // componentDidUpdate () {
  //   const { currentSelectedPlanCost, annualPlanPrice } = this.state;

  //   if (!currentSelectedPlanCost) {
  //     this.setState({  currentSelectedPlanCost: currentSelectedPlanCost || annualPlanPrice });
  //   }
  // }

  onCouponInputChange (e) {
    this.setState({ couponCodeInputValue: e.target.value });
  }

  backToApplyCoupon = () => {
    this.setState({ paidAccountProcessStep: 'selectPlanDetailsMobile' });
  }

  couponAppliedFunction = () => {
    this.setState({ paidAccountProcessStep: 'payForPlan' });

    if (window.innerWidth > 769) {
      this.setState({
        paidAccountProcessStep: 'payForPlan',
      });
    } else {
      this.setState({
        paidAccountProcessStep: 'payForPlanMobile',
      });
    }
  }

  paymentProcessedFunction = () => {
    // console.log('paymentProcessedFunction');
    this.setState({
      paidAccountProcessStep: 'paymentProcessed',
    });
  }

  pricingPlanChosenFunction = (pricingPlanChosen) => {
    if (window.innerWidth > 769 && pricingPlanChosen !== 'free') {
      this.setState({
        paidAccountProcessStep: 'payForPlan',
        pricingPlanChosen,
      });
    } else if (pricingPlanChosen !== 'free') {
      this.setState({
        paidAccountProcessStep: 'selectPlanDetailsMobile',
        pricingPlanChosen,
      });
    } else {
      this.props.toggleFunction(this.state.pathname);
    }

    switch (pricingPlanChosen) {
      case 'professional':
        this.setState({ monthlyPlanPrice: 150, annualPlanPrice: 125, monthlyPlanPriceWithDiscount: 150, annualPlanPriceWithDiscount: 125, currentSelectedPlanCost: 125 });
        break;
      case 'enterprise':
        this.setState({ monthlyPlanPrice: 200, annualPlanPrice: 175, monthlyPlanPriceWithDiscount: 200, annualPlanPriceWithDiscount: 175, currentSelectedPlanCost: 175 });
        break;
      default:
        this.setState({ monthlyPlanPrice: 150, annualPlanPrice: 125, monthlyPlanPriceWithDiscount: 150, annualPlanPriceWithDiscount: 125, currentSelectedPlanCost: 125 });
    }
  }

  handleRadioGroupChange = (event) => {
    // console.log('handleRadioGroupChange');
    const { radioGroupValue, monthlyPlanPriceWithDiscount, annualPlanPriceWithDiscount } = this.state;
    if (radioGroupValue !== event.target.value) {
      this.setState({
        radioGroupValue: event.target.value || '',
      });
    }
    if (event.target.value === 'annualPlanRadio') {
      this.setState({ currentSelectedPlanCost: annualPlanPriceWithDiscount });
    } else {
      this.setState({ currentSelectedPlanCost: monthlyPlanPriceWithDiscount });
    }
  }

  backToChoosePlan () {
    this.setState({ paidAccountProcessStep: '' });
  }

  resetCouponCode () {
    const { annualPlanPrice, monthlyPlanPrice, radioGroupValue } = this.state;

    this.setState({ isCouponApplied: false, couponCodeInputValue: '', monthlyPlanPriceWithDiscount: monthlyPlanPrice, annualPlanPriceWithDiscount: annualPlanPrice });

    if (radioGroupValue === 'annualPlanRadio') {
      this.setState({ currentSelectedPlanCost: annualPlanPrice });
    } else {
      this.setState({ currentSelectedPlanCost: monthlyPlanPrice });
    }
  }

  checkCouponCodeValidity () {
    const { couponCodeInputValue, couponCodesFromAPI, monthlyPlanPrice, annualPlanPrice, currentSelectedPlanCost: oldCurrentSelectedPlanCost } = this.state;

    let wasCouponMatchFound = false;

    for (let i = 0; i < couponCodesFromAPI.length; i++) {
      if (couponCodesFromAPI[i].code.toLowerCase() === couponCodeInputValue.toLowerCase()) {
        this.setState({
          isCouponApplied: true,
          couponDiscountValue: couponCodesFromAPI[i].discount,
          monthlyPlanPriceWithDiscount: monthlyPlanPrice - couponCodesFromAPI[i].discount,
          annualPlanPriceWithDiscount: annualPlanPrice - couponCodesFromAPI[i].discount,
          currentSelectedPlanCost: oldCurrentSelectedPlanCost - couponCodesFromAPI[i].discount,
        });

        console.log(couponCodesFromAPI[i], 'match was found');

        wasCouponMatchFound = true;
      }
    }

    if (wasCouponMatchFound === false) {
      this.setState({ couponCodeError: true, couponCodeInputValue: '' });
      setTimeout(() => {
        this.setState({ couponCodeError: false });
      }, 3000);
    }
  }

  closePaidAccountUpgradeModal () {
    this.props.toggleFunction(this.state.pathname);
  }

  render () {
    renderLog(__filename);
    const { classes } = this.props;
    const { radioGroupValue, couponCodeInputValue, couponDiscountValue, isCouponApplied, paidAccountProcessStep, pricingPlanChosen, monthlyPlanPrice, annualPlanPrice, couponCodeError, monthlyPlanPriceWithDiscount, annualPlanPriceWithDiscount, currentSelectedPlanCost } = this.state;

    console.log('Annual plan price:', annualPlanPriceWithDiscount);
    console.log('Monthly plan price:', monthlyPlanPriceWithDiscount);
    console.log('Current selected plan price:', currentSelectedPlanCost);



    let modalTitle = '';
    let backToButton;
    let modalHtmlContents = <span />;
    const planNameTitle = `${pricingPlanChosen} Plan`;
    const couponDiscountValueString = ` $${couponDiscountValue}`;

    switch (paidAccountProcessStep) {
      case 'choosePlan':
      default:
        modalTitle = 'Choose Your Plan';
        modalHtmlContents = (
          <Pricing
            initialPricingPlan={this.state.pricingPlanChosen ? this.state.pricingPlanChosen : this.props.initialPricingPlan}
            modalDisplayMode
            pricingPlanChosenFunction={this.pricingPlanChosenFunction}
          />
        );
        break;
      case 'selectPlanDetailsMobile':
        backToButton = (
          <Button className={classes.backToButton} onClick={this.backToChoosePlan}>
            {isIOS() ? <ArrowBackIos /> : <ArrowBack />}
            Choose Plan
          </Button>
        );
        modalTitle = 'Payment Plan';
        modalHtmlContents = (
          <MobileWrapper className="u-full-height">
            <FlexSectionOne>
              <SectionTitle>
                {planNameTitle}
              </SectionTitle>
              {isCouponApplied ? (
                <div
                  className={classes.couponAlert}
                >
                  Coupon Applied. Deducted
                  {couponDiscountValueString}
                </div>
              ) : null}
              {couponCodeError ? (
                <div
                  className={classes.couponAlertError}
                >
                  Invalid Coupon Code
                </div>
              ) : null}
              {radioGroupValue === 'annualPlanRadio' ? (
                <Fieldset>
                  <FormControl classes={{ root: classes.formControl }}>
                    <RadioGroup
                      name="planRadioGroup"
                      value={radioGroupValue}
                      onChange={this.handleRadioGroupChange}
                    >
                      <FormControlLabel
                        classes={{ root: classes.formControlLabel, label: classes.formControlLabelSpan }}
                        value="annualPlanRadio"
                        control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                        label={(
                          <>
                            <PriceLabelDollarSign>$</PriceLabelDollarSign>
                            <PriceLabel>{annualPlanPriceWithDiscount}</PriceLabel>
                            <PriceLabelSubText> /mo</PriceLabelSubText>
                            <MobilePricingPlanName>Billed Annually</MobilePricingPlanName>
                          </>
                        )}
                        onClick={this.handleRadioGroupChoiceSubDomain}
                        checked={radioGroupValue === 'annualPlanRadio'}
                      />
                    </RadioGroup>
                  </FormControl>
                </Fieldset>
              ) : (
                <FieldsetDisabled>
                  <FormControl classes={{ root: classes.formControl }}>
                    <RadioGroup
                      name="planRadioGroup"
                      value={radioGroupValue}
                      onChange={this.handleRadioGroupChange}
                    >
                      <FormControlLabel
                        classes={{ root: classes.formControlLabel, label: classes.formControlLabelSpan }}
                        value="annualPlanRadio"
                        control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                        label={(
                          <>
                            <PriceLabelDollarSign>$</PriceLabelDollarSign>
                            <PriceLabel>{annualPlanPriceWithDiscount}</PriceLabel>
                            <PriceLabelSubText> /mo</PriceLabelSubText>
                            <MobilePricingPlanName>Billed Annually</MobilePricingPlanName>
                          </>
                        )}
                        onClick={this.handleRadioGroupChoiceSubDomain}
                        checked={radioGroupValue === 'annualPlanRadio'}
                      />
                    </RadioGroup>
                  </FormControl>
                </FieldsetDisabled>
              )}
              {radioGroupValue === 'monthlyPlanRadio' ? (
                <Fieldset>
                  <FormControl classes={{ root: classes.formControl }}>
                    <RadioGroup
                      name="planRadioGroup"
                      value={radioGroupValue}
                      onChange={this.handleRadioGroupChange}
                    >
                      <FormControlLabel
                        classes={{ root: classes.formControlLabel, label: classes.formControlLabelSpan }}
                        value="monthlyPlanRadio"
                        control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                        label={(
                          <>
                            <PriceLabelDollarSign>$</PriceLabelDollarSign>
                            <PriceLabel>{monthlyPlanPriceWithDiscount}</PriceLabel>
                            <PriceLabelSubText> /mo</PriceLabelSubText>
                            <MobilePricingPlanName>Billed Monthly</MobilePricingPlanName>
                          </>
                        )}
                        onClick={this.handleRadioGroupChoiceSubDomain}
                        checked={radioGroupValue === 'monthlyPlanRadio'}
                      />
                    </RadioGroup>
                  </FormControl>
                </Fieldset>
              ) : (
                <FieldsetDisabled>
                  <FormControl classes={{ root: classes.formControl }}>
                    <RadioGroup
                      name="planRadioGroup"
                      value={radioGroupValue}
                      onChange={this.handleRadioGroupChange}
                    >
                      <FormControlLabel
                        classes={{ root: classes.formControlLabel, label: classes.formControlLabelSpan }}
                        value="monthlyPlanRadio"
                        control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                        label={(
                          <>
                            <PriceLabelDollarSign>$</PriceLabelDollarSign>
                            <PriceLabel>{monthlyPlanPriceWithDiscount}</PriceLabel>
                            <PriceLabelSubText> /mo</PriceLabelSubText>
                            <MobilePricingPlanName>Billed Monthly</MobilePricingPlanName>
                          </>
                        )}
                        onClick={this.handleRadioGroupChoiceSubDomain}
                        checked={radioGroupValue === 'monthlyPlanRadio'}
                      />
                    </RadioGroup>
                  </FormControl>
                </FieldsetDisabled>
              )}
              <br />
              <SectionTitle>Coupon Code</SectionTitle>
              <OutlinedInput
                classes={{ root: isCouponApplied ? classes.textFieldCouponApplied : classes.textField, input: couponCodeInputValue !== '' ? classes.textFieldInputUppercase : classes.textFieldInput }}
                inputProps={{ }}
                margin="normal"
                // variant="outlined"
                placeholder="Enter Here..."
                fullWidth
                onChange={this.onCouponInputChange}
                disabled={isCouponApplied}
                value={couponCodeInputValue}
              />
              {isCouponApplied ? (
                <>
                  <div
                    className={classes.couponAlert}
                  >
                    APPLIED
                  </div>
                  <Button size="small" className={classes.resetButton} onClick={this.resetCouponCode}>
                    Use new code
                  </Button>
                </>
              ) : (
                <Button
                  disabled={couponCodeInputValue === ''}
                  fullWidth
                  variant="contained"
                  margin="normal"
                  color="primary"
                  classes={{ root: classes.couponButton }}
                  onClick={this.checkCouponCodeValidity}
                >
                  APPLY
                </Button>
              )}
            </FlexSectionOne>
            <FlexSectionTwo>
              <Button
                color="primary"
                variant="contained"
                classes={{ root: classes.nextButton }}
                onClick={this.couponAppliedFunction}
              >
                NEXT
              </Button>
            </FlexSectionTwo>

          </MobileWrapper>
        );
        break;
      case 'payForPlanMobile':
        backToButton = (
          <Button className={classes.backToButton} onClick={this.backToApplyCoupon}>
            {isIOS() ? <ArrowBackIos /> : <ArrowBack />}
            Select Plan Details
          </Button>
        );
        modalTitle = 'Payment';
        modalHtmlContents = (
          <MobileWrapper>
            <SectionTitle>
              Payment for $
              {currentSelectedPlanCost}
            </SectionTitle>
          </MobileWrapper>
        );
        break;
      case 'payForPlan':
        backToButton = (
          <Button className={classes.backToButton} onClick={this.backToChoosePlan}>
            {isIOS() ? <ArrowBackIos /> : <ArrowBack />}
            Choose Plan
          </Button>
        );
        modalTitle = 'Payment';
        modalHtmlContents = (
          <Row className="row u-full-height">
            <div className="col col-6 pr-0 u-full-height">
              <WrapperLeft className="u-full-height">
                <div className="u-tc">
                  <SectionTitle>
                    {planNameTitle}
                  </SectionTitle>
                </div>
                {radioGroupValue === 'annualPlanRadio' ? (
                  <Fieldset>
                    <Legend>
                      Billed Annually
                    </Legend>
                    <FormControl classes={{ root: classes.formControl }}>
                      <RadioGroup
                        name="planRadioGroup"
                        value={radioGroupValue}
                        onChange={this.handleRadioGroupChange}
                      >
                        <FormControlLabel
                          classes={{ root: classes.formControlLabel }}
                          value="annualPlanRadio"
                          control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                          label={(
                            <>
                              <PriceLabelDollarSign>$</PriceLabelDollarSign>
                              <PriceLabel>{annualPlanPriceWithDiscount}</PriceLabel>
                              <PriceLabelSubText> /mo</PriceLabelSubText>
                            </>
                          )}
                          onClick={this.handleRadioGroupChoiceSubDomain}
                          checked={radioGroupValue === 'annualPlanRadio'}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Fieldset>
                ) : (
                  <FieldsetDisabled>
                    <Legend>
                      Billed Annually
                    </Legend>
                    <FormControl classes={{ root: classes.formControl }}>
                      <RadioGroup
                        name="planRadioGroup"
                        value={radioGroupValue}
                        onChange={this.handleRadioGroupChange}
                      >
                        <FormControlLabel
                          classes={{ root: classes.formControlLabel }}
                          value="annualPlanRadio"
                          control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                          label={(
                            <>
                              <PriceLabelDollarSign>$</PriceLabelDollarSign>
                              <PriceLabel>{annualPlanPriceWithDiscount}</PriceLabel>
                              <PriceLabelSubText> /mo</PriceLabelSubText>
                            </>
                          )}
                          onClick={this.handleRadioGroupChoiceSubDomain}
                          checked={radioGroupValue === 'annualPlanRadio'}
                        />
                      </RadioGroup>
                    </FormControl>
                  </FieldsetDisabled>
                )}
                {radioGroupValue === 'monthlyPlanRadio' ? (
                  <Fieldset>
                    <Legend>
                      Billed Monthly
                    </Legend>
                    <FormControl classes={{ root: classes.formControl }}>
                      <RadioGroup
                        name="planRadioGroup"
                        value={radioGroupValue}
                        onChange={this.handleRadioGroupChange}
                      >
                        <FormControlLabel
                          classes={{ root: classes.formControlLabel }}
                          value="monthlyPlanRadio"
                          control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                          label={(
                            <>
                              <PriceLabelDollarSign>$</PriceLabelDollarSign>
                              <PriceLabel>{monthlyPlanPriceWithDiscount}</PriceLabel>
                              <PriceLabelSubText> /mo</PriceLabelSubText>
                            </>
                          )}
                          onClick={this.handleRadioGroupChoiceSubDomain}
                          checked={radioGroupValue === 'monthlyPlanRadio'}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Fieldset>
                ) : (
                  <FieldsetDisabled>
                    <Legend>
                      Billed Monthly
                    </Legend>
                    <FormControl classes={{ root: classes.formControl }}>
                      <RadioGroup
                        name="planRadioGroup"
                        value={radioGroupValue}
                        onChange={this.handleRadioGroupChange}
                      >
                        <FormControlLabel
                          classes={{ root: classes.formControlLabel }}
                          value="monthlyPlanRadio"
                          control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                          label={(
                            <>
                              <PriceLabelDollarSign>$</PriceLabelDollarSign>
                              <PriceLabel>{monthlyPlanPriceWithDiscount}</PriceLabel>
                              <PriceLabelSubText> /mo</PriceLabelSubText>
                            </>
                          )}
                          onClick={this.handleRadioGroupChoiceSubDomain}
                          checked={radioGroupValue === 'monthlyPlanRadio'}
                        />
                      </RadioGroup>
                    </FormControl>
                  </FieldsetDisabled>
                )}
              </WrapperLeft>
            </div>
            <div className="col col-6 pl-0 u-full-height">
              <WrapperRight className="u-full-height">
                <div className="u-tc">
                  <h3 className="h3">Stripe Payment</h3>
                </div>
              </WrapperRight>
            </div>
          </Row>
        );
        break;
      case 'paymentProcessed':
        modalTitle = 'Payment Processed';
        modalHtmlContents = (
          <span>
            Thank you for choosing the
            {' '}
            {pricingPlanChosen}
            {' '}
            plan! Your payment has been processed, and features have been unlocked. You payed $
            {currentSelectedPlanCost}
            <ButtonsContainer>
              <Button
                color="primary"
                onClick={() => { this.props.toggleFunction(this.state.pathname); }}
                variant="contained"
              >
                Continue
              </Button>
            </ButtonsContainer>
          </span>
        );
        break;
    }
    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(this.state.pathname); }}
      >
        {paidAccountProcessStep === '' ? (
          <ModalTitleAreaNoBoxShadow>
            {backToButton}
            <Title>
              {modalTitle}
            </Title>
            <IconButton
              aria-label="Close"
              className={classes.closeButton}
              onClick={this.closePaidAccountUpgradeModal}
              id="profileClosePaidAccountUpgradeModal"
            >
              <CloseIcon />
            </IconButton>
          </ModalTitleAreaNoBoxShadow>
        ) : (
          <ModalTitleArea>
            {backToButton}
            <Title>
              {modalTitle}
            </Title>
            <IconButton
              aria-label="Close"
              className={classes.closeButton}
              onClick={this.closePaidAccountUpgradeModal}
              id="profileClosePaidAccountUpgradeModal"
            >
              <CloseIcon />
            </IconButton>
          </ModalTitleArea>
        )}

        {paidAccountProcessStep === '' ? (
          <DialogContent classes={{ root: classes.dialogContentWhite }}>
            {modalHtmlContents}
          </DialogContent>
        ) : (
          <DialogContent classes={{ root: classes.dialogContent }}>
            {modalHtmlContents}
          </DialogContent>
        )}
      </Dialog>
    );
  }
}
const styles = () => ({
  button: {
    marginRight: 8,
  },
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    '@media (min-width: 768px)': {
      minWidth: '65%',
      maxWidth: '720px',
      width: '85%',
      minHeight: '95%',
      maxHeight: '95%',
      height: '95%',
      margin: '0 auto',
    },
    '@media (max-width: 768px)': {
      minWidth: '100%',
      maxWidth: '100%',
      width: '100%',
      minHeight: '100%',
      maxHeight: '100%',
      height: '100%',
      margin: '0 auto',
    },
  },
  dialogContent: {
    '@media (max-width: 768px)': {
      background: '#f7f7f7',
      padding: '0 8px 8px',
    },
    background: 'white',
  },
  dialogContentWhite: {
    '@media (max-width: 768px)': {
      padding: '0 8px 8px',
    },
    background: 'white',
  },
  formControl: {
    width: '100%',
    padding: '0 0 3px',
    '@media (max-width: 768px)': {
      padding: 0,
    },
  },
  backToButton: {
    color: '#666',
    fontWeight: 'bold',
    margin: 0,
    textTransform: 'none',
    '@media (min-width: 768px)': {
      position: 'absolute',
      top: 16,
      left: 12,
    },
  },
  closeButton: {
    margin: 0,
    display: 'none',
    '@media (min-width: 768px)': {
      display: 'block',
      position: 'absolute',
      top: 9,
      right: 8,
    },
  },
  formControlLabel: {
    margin: 0,
    padding: '0px 16px 0 8px',
    height: '100%',
    width: '100%',
    '@media (max-width: 768px)': {
      padding: '8px 16px 8px 8px',
    },
    '@media (max-width: 569px)': {
      padding: '4px 8px 4px 4px',
    },
  },
  formControlLabelSpan: {
    width: '100%',
  },
  radioButton: {
    width: 45.4,
    height: 45.4,
    padding: 12,
    pointerEvents: 'auto',
  },
  textField: {
    background: 'white',
    marginTop: 0,
    marginBottom: 8,
    height: 50,
    fontSize: 16.5,
    '@media (max-width: 569px)': {
      height: 40,
      fontSize: 14,
    },
  },
  textFieldCouponApplied: {
    height: 50,
    fontSize: 16.5,
    '@media (max-width: 569px)': {
      height: 40,
      fontSize: 14,
    },
    background: 'white',
    marginTop: 0,
    marginBottom: 8,
    color: '#386949',
  },
  textFieldInput: {
    fontWeight: 'bold',
  },
  textFieldInputUppercase: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  couponButton: {
    height: 45,
    fontSize: 16.5,
    fontWeight: 'bold',
    '@media (max-width: 569px)': {
      height: 35,
      fontSize: 14,
    },
  },
  couponAlert: {
    background: '#c1f4c9',
    color: '#386949',
    boxShadow: 'none',
    pointerEvents: 'none',
    fontWeight: 'bold',
    marginBottom: 8,
    height: 45,
    fontSize: 16.5,
    width: '100%',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    '@media (max-width: 569px)': {
      height: 35,
      fontSize: 14,
    },
  },
  couponAlertError: {
    background: 'rgb(255, 177, 160)',
    color: 'rgb(163, 40, 38)',
    boxShadow: 'none',
    pointerEvents: 'none',
    fontWeight: 'bold',
    marginBottom: 8,
    height: 45,
    fontSize: 16.5,
    width: '100%',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    '@media (max-width: 569px)': {
      height: 35,
      fontSize: 14,
    },
  },
  resetButton: {
    float: 'right',
    textDecoration: 'underline',
  },
  nextButton: {
    height: 45,
    fontSize: 16.5,
    '@media (max-width: 569px)': {
      height: 35,
      fontSize: 14,
    },
    width: '100%',
  },
});

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center !important;
  width: fit-content;
  width: 100%;
  margin-top: 12px;
`;

const ModalTitleArea = styled.div`
  width: 100%;
  padding: 16px 12px;
  box-shadow: 0 20px 40px -25px #999;
  z-index: 999;
  @media (min-width: 768px) {
    text-align: center;
    box-shadow: none;
    border-bottom: 2px solid #f7f7f7;
  }
`;

const ModalTitleAreaNoBoxShadow = styled.div`
  width: 100%;
  padding: 16px 12px;
  z-index: 999;
  @media (min-width: 768px) {
    text-align: center;
    border-bottom: 2px solid #f7f7f7;
  }
  @media (max-width: 376px) {
    padding: 8px 6px;
  }
`;

// const BackToButton = styled.div`
//   margin: 0;
//   @media (min-width: 768px) {
//     position: absolute;
//     top: 8;
//     left: 4;
//   }
// `;

const Title = styled.h3`
  font-weight: bold;
  font-size: 24px;
  margin-top: 8px;
  position: relative;
  left: 8px;
  color: black;
  @media (min-width: 768px) {
    font-size: 28px;
    left: 0;
    margin: 0 auto;
    width: fit-content;
  }
`;

const SectionTitle = styled.h4`
  color: #666;
  font-size: 20px;
  font-weight: bold;
  text-transform: capitalize;
  margin-bottom: 16px;
  @media (min-width: 768px) {
    color: black;
    font-weight: bold;
  }
  @media (max-width: 376px) {
    font-size: 18px;
  }
`;

const Row = styled.div`
  max-width: 700px;
  margin: 0 auto !important;
`;

const MobileWrapper = styled.div`
  padding: 32px 18px 16px;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: space-between;
  max-height: 
`;

const FlexSectionOne = styled.div`
  margin: 0;  
`;

const FlexSectionTwo = styled.div`
  margin: 0;
`;

const WrapperLeft = styled.div`
  padding: 0 32px 32px;
  border-right: 1px solid #f7f7f7;
  margin-top: 32px;
`;

const WrapperRight = styled.div`
  padding: 0 32px 32px;
  border-left: 1px solid #f7f7f7;
  margin-top: 32px;
`;

const Fieldset = styled.fieldset`
  border: 2px solid ${({ theme }) => theme.colors.main};
  border-radius: 3px;
  margin-bottom: 16px;
  padding-bottom: 0;
  background: white;
`;

const FieldsetDisabled = styled.fieldset`
  border: 2px solid #ddd;
  border-radius: 3px;
  margin-bottom: 16px;
  padding-bottom: 0;
  background: white;
`;

const Legend = styled.legend`
  color: ${({ theme }) => theme.colors.main};
  font-size: 12px;
  text-align: left;
  margin: 0;
  margin-left: 16px;
  padding: 0px 8px;
  width: fit-content;
`;

const PriceLabel = styled.span`
  font-size: 40px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.main};
  margin-left: 4px;
  @media (max-width: 569px) {
    font-size: 32px;
  }
`;

const PriceLabelDollarSign = styled.span`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.main};
  position: relative;
  top: -12px;
  font-weight: bold;
  @media (max-width: 569px) {
    font-size: 16px;
  }
`;

const PriceLabelSubText = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.main};
  @media (max-width: 569px) {
    font-size: 14px;
  }
`;

const MobilePricingPlanName = styled.span`
  color: ${({ theme }) => theme.colors.main};
  font-size: 18px;
  font-weight: bold;
  v-align: middle;
  position: relative;
  top: 16.8px;
  float: right;
  @media (max-width: 569px) {
    font-size: 14px;
    top: 13.6px;
  }
`;

export default withTheme(withStyles(styles)(PaidAccountUpgradeModal));
