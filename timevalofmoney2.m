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


% tables of all assets and liabilities
liab = [-12000, 0.025; -27496, 0.0655; -1725, 0.08;-5274,0.0655];
asset = [66000,0.06];

payment = 4900; % monthly payment you wish to make
invpay = 2200; % set a monthly amount if you want to invest right away instead
            % of placing 100% of available 'payment' into debts.
            % if 0, the program assumes all extra payment goes to debt
            % repayment first.
n = 12; % 12 months in a year
horizon = 6; % maximum number of years you want to pay off any loan


% need an infinite loop check - is your min payment enough to EVER pay it
% off?
for i=1:1:length(liab(:,1))
minpay(i) = (-liab(i,1)*(liab(i,2)/n))/(1-(1+liab(i,2)/n)^(-n*horizon));
end
minpaytot = sum(minpay(:));

while payment-invpay < minpaytot
    payment = input(['Your min payment is too small! Increase it to at least ' num2str(ceil(minpaytot)+invpay) ': ']);
end
%

% determine any extra amount of money beyond the minimums
if payment > minpaytot
    extra = payment-invpay-minpaytot;
else
    extra = 0;
end

% allocate the extra money to the right loan

[rates,payorder] = sort(liab(:,2),'descend');

% Initialize while loop
clear presval1
clear presval2
clear asset1
curliab = liab(:,1);
curasset = asset(:,1);
networth = sum(curliab(:),curasset(:));
period = 0; % initial period
t=1; % # of periods per cycle of while loop


while networth(period+1) < stopval
    %% Determine Pay Order
    %% Determine Payment Amounts
        % include final pmt check
        
        
        for i=1:1:length(curliab(:,period+1))
            if curliab(payorder(i),period+1) ~= 0
                if extra ~= 0;
                    if curliab(payorder(i),period+1) >= minpay(payorder(i))+extra
                        payment(payorder(i)) = minpay(payorder(i))+extra;
                        extra = 0;
                    elseif curliab(payorder(i),period+1) < minpay(payorder(i))
                        payment(payorder(i)) = curliab(payorder(i),period+1);
                        extra = extra + (minpay(payorder(i)) - payment(payorder(i)));
                    elseif curliab(payorder(i),period+1) < minpay(payorder(i))+extra
                        payment(payorder(i)) = curliab(payorder(i),period+1);
                        extra = (extra+minpay(payorder(i)))-curliab(payorder(i));
                    else
                        error('out of bounds')
                    end
                elseif extra == 0;
                    payment(payorder(i)) = minpay(payorder(i));
                else
                    error('missed something in the extra payment allocation')
                end
                
            elseif curliab(payorder(i),period+1) == 0
                payment(payorder(i)) = 0;
            else
                error('out of bounds')
            end
    %% Pay and Accumulate
    curliab(payorder(i),period+2) = curliab(payorder(i),period+1) + payment(payorder(i));
    curliab(payorder(i),period+2) = curliab(payorder(i),period+2)*(1+rates(i)/n)^t;
        end
        
    curasset(period+2) = curasset(period+1) + invpay + extra;
    curasset(period+2) = curasset(period+2)*(1+asset(1,2)/n)^t;
        
    %% calculate networth
    
    networth(period+2) = sum([curliab(:,period+2);curasset(period+2)]);
    
    %% increment time
    period = period+1;
    
end

%% Results Plotting

disp(['It will take you ' num2str(period) ' months or ' num2str(period/n) ' years to finish.'])

for i=1:1:length(curliab(:,period+1))
    plot(curliab(i,:),'LineStyle','--')
    hold on
end
plot(curasset(:),'LineStyle',':')
plot(networth,'LineStyle','-')