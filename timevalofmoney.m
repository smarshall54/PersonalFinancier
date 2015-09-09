

% input variables
principal1 = -10000;
rate1 = 0.07; % always as a decimal fraction

principal2 = -17496;
rate2 = 0.057;

payment = 50; % monthly payment you wish to make
n = 12; % 12 months in a year
horizon = 10; % maximum number of years you want to pay off any loan

% need an infinite loop check - is your min payment enough to EVER pay it
% off?

minpay1 = (-principal1*(rate1/n))/(1-(1+rate1/n)^(-n*horizon));
minpay2 = (-principal2*(rate2/n))/(1-(1+rate1/n)^(-n*horizon));
minpay = minpay1+minpay2;

while payment < minpay
    payment = input(['Your min payment is too small! Increase it to at least ' num2str(ceil(minpay)) ': ']);
end
%


% Initialize while loop
clear presval
presval(1) = principal1;
stopval = 000000;
period = 0; % initial period
t=1; % # of periods per cycle of while loop


while presval(period+1) < stopval
    
    presval(period+2) = presval(period+1)+payment;
    presval(period+2) = presval(period+2)*(1+rate1/n)^t;
    if presval(period+2) <= presval(period+1)
        error('You will never pay this off! Use a higher Min Payment!')
    end
    period = period+1;
    
end

disp(['It will take you ' num2str(period) ' months or ' num2str(period/n) ' years to finish.'])
hold on
plot(presval)