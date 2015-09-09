clear all

%
% upcoming work: 
% 1. functionalize the code to support arbitrary # of loans/assets
% 2. calculate debt payoff timeline
% 3. support adding loans or assets and spending savings @ user-defined
% time points (e.g. house purchase or inheritance)
% 4. support payment inflation (due to salary raises)
% 5. support tax-deferred assets, salary tax estimates
% 6. build a gui
%


% input variables

stopval = 500000;

% have to assume these are loans for now... build in asset functionality
% next
principal1 = -12000;
rate1 = 0.025; % always as a decimal fraction

principal2 = -27496;
rate2 = 0.0655;


value1 = 66000; % initial asset value
ror1 = 0.06; % asset rate of return

payment = 4900; % monthly payment you wish to make
invpay = 2200; % set a monthly amount if you want to invest right away instead
            % of placing 100% of available 'payment' into debts.
            % if 0, the program assumes all extra payment goes to debt
            % repayment first.
n = 12; % 12 months in a year
horizon = 6; % maximum number of years you want to pay off any loan


% need an infinite loop check - is your min payment enough to EVER pay it
% off?

minpay1 = (-principal1*(rate1/n))/(1-(1+rate1/n)^(-n*horizon));
minpay2 = (-principal2*(rate2/n))/(1-(1+rate1/n)^(-n*horizon));
minpay = minpay1+minpay2;

while payment-invpay < minpay
    payment = input(['Your min payment is too small! Increase it to at least ' num2str(ceil(minpay)+invpay) ': ']);
end
%

% determine any extra amount of money beyond the minimums
if payment > minpay
    extra = payment-invpay-minpay;
else
    extra = 0;
end

% allocate the extra money to the right loan
ratechk = max(rate1,rate2);
if ratechk==rate1
    payment1 = minpay1+extra;
    payment2 = minpay2;
else
    payment1=minpay1;
    payment2 = minpay2+extra;
end

if payment~=(payment1+payment2+invpay)
    error('borked some math')
end

% Initialize while loop
clear presval1
clear presval2
clear asset1
presval1(1) = principal1;
presval2(1) = principal2;
asset1(1) = value1;
networth(1) = principal1+principal2+value1;
period = 0; % initial period
t=1; % # of periods per cycle of while loop


while networth(period+1) < stopval
    
    % loan 1
    % payoff check and re-allocate payments
    % also handle final payment period remainders
    if presval1(period+1)+payment1 >= 0
        
        finpay1 = -presval1(period+1); % calc. the amount of the final payment
        % apply the final payment and re-calculate the loan value (should be 0)
        presval1(period+2) = presval1(period+1)+finpay1; 
        if presval1(period+2)~=0
            disp('borked some finpay1 math.')
        end
        
        payment2=payment2+payment1;
        payment1=0;
    else
        presval1(period+2) = presval1(period+1)+payment1;
        presval1(period+2) = presval1(period+2)*(1+rate1/n)^t;
    end
    
    if presval1(period+2) < presval1(period+1)
        error('You will never pay this off! Use a higher Min Payment!')
    end
    
    % loan 2
    if presval2(period+1)+payment2 >= 0
        
        finpay2 = -presval2(period+1);
        presval2(period+2) = presval2(period+1)+finpay2;
        if presval2(period+2)~=0
            disp('borked some finpay2 math.')
            disp(period)
        end
        
        payment1=payment1+payment2;
        payment2=0;
    else
        presval2(period+2) = presval2(period+1)+payment2;
        presval2(period+2) = presval2(period+2)*(1+rate2/n)^t;
    end
    
    if presval2(period+2) < presval2(period+1)
        error('You will never pay this off! Use a higher Min Payment!')
    end
    
    if presval2(period+2)==0&&presval1(period+2)==0
        payment1=0;
        payment2=0;
    end
    
    % asset 1
        asset1(period+2) = asset1(period+1)+(payment-(payment1+payment2));
        asset1(period+2) = asset1(period+2)*(1+ror1/n)^t;
    
    
    networth(period+2) = presval2(period+2)+presval1(period+2)+asset1(period+2);
    period = period+1;
    
end

disp(['It will take you ' num2str(period) ' months or ' num2str(period/n) ' years to finish.'])
hold on
plot(presval1,'LineStyle','--')
hold on
plot(presval2,'LineStyle','--')
plot(asset1,'LineStyle',':')
plot(networth,'LineStyle','-')