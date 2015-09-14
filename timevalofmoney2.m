clear all

%
% upcoming work: 
% 0. support arbitrary # of loans/assets [XX]
% 1. functionalize/OO the code to clean it up!
% 2. calculate debt payoff timeline [XX]
% 3. support adding loans or assets and spending savings @ user-defined
%   time points (e.g. house purchase or inheritance) [XX]
% 4. support payment inflation (due to salary raises)
% 5. support tax-deferred assets, salary tax estimates
% 6. build a gui
%


%% Define your Situation

% FIRE target value:
stopval = 500000;

n = 12; % 12 months in a year... assume all debts are compounded monthly for simplicity
horizon = 6; % maximum number of years you want to pay off any loan


% tables of all assets and liabilities
%
%                FORMAT
% [[    amount1, rate1, startperiod1   ]
%       amount2, rate2, startperiod2   ]
%       ...    , ...  , ...            ]]
%
liab = [-12000, 0.025, 0; -27496, 0.0655, 0; -50000, 0.03, 40];% -1725, 0.08;-5274,0.0655];
liabname = {'citi';'mohela';'house'};
asset = [66000,0.05,0;15000,.0085,0];% [66000,0.06;15000,0.0085];
assetname = {'retirement acct';'cash savings'};

% define any withdrawals or additions to assets in future time periods
%               FORMAT
% [[    amount, asset#, timeperiod    ]]
% 
% where asset# is the asset that will be liquidated to pay it down

withdraws = [-50000, 2, 40;-5000, 2, 36];
% currently allows you to withdraw more than the account value...

% Your cashflow and spending allocation
%       make these time vectors that can be edited by the GUI
%       will require re-evaluating them every time period
cashflow = 4900; % monthly payment you wish to make
invpay = [1800,400]; % set a monthly amount if you want to invest right away instead
            % of placing 100% of available 'payment' into debts.
            % if 0, the program assumes all extra payment goes to debt
            % repayment first.
invdist = [0.55,0.45];

% sanity checks on user input values
if sum(invdist)~=1
    error('investment distribution must = 100%')
end
if length(invpay)~=length(asset(:,1))
    error('must specify a payment amount for each asset')
end

% infinite loop check - is your min payment enough to EVER pay it off?
for i=1:1:length(liab(:,1))
minpay(i) = (-liab(i,1)*(liab(i,2)/n))/(1-(1+liab(i,2)/n)^(-n*horizon));
end
minpaytot = sum(minpay(:));

while cashflow-sum(invpay) < minpaytot
    cashflow = input(['Your cashflow is too small! Increase it to at least ' num2str(ceil(minpaytot)+invpay) ': ']);
end

% allocate the extra money to the right loan
%   right now, assumes "avalanche" paydown method
%   can add functionality for user-input order or snowball if desired
[rates,payorder] = sort(liab(:,2),'descend');

% Initialize while loop
period = 0; % initial time period (month)

% define the current liabilities and assets in the start period and in any
% future periods
for i=1:1:length(liab(:,1,1))
    curliab(i, liab(i,3)+1) = liab(i,1);
end

for i=1:1:length(asset(:,1,1))
    curasset(i,asset(i,3)+1) = asset(i,1);
end

% define your starting networth
networth = sum(curliab(:))+curasset(:);

t=1; % # of periods per cycle of while loop. leave as 1.

% This is the main time-iterating loop
while networth(period+1) < stopval
    
    %% Check for balance updates
    
    
    %% Determine Pay Order and Payment Amounts
    % include final pmt check
    % determine any extra amount of money beyond the minimums
    if cashflow > minpaytot
        extra = cashflow-sum(invpay)-minpaytot;
    else
        extra = 0;
    end
    
    for i=1:1:length(curliab(:,period+1))
        if curliab(payorder(i),period+1) ~= 0
            if extra ~= 0;
                if -curliab(payorder(i),period+1) >= minpay(payorder(i))+extra
                    payment(payorder(i)) = minpay(payorder(i))+extra;
                    extra = 0;
                elseif -curliab(payorder(i),period+1) < minpay(payorder(i))
                    payment(payorder(i)) = -curliab(payorder(i),period+1);
                    extra = extra + (minpay(payorder(i)) - payment(payorder(i)));
                elseif -curliab(payorder(i),period+1) < minpay(payorder(i))+extra
                    payment(payorder(i)) = -curliab(payorder(i),period+1);
                    extra = (extra+minpay(payorder(i)))-(-curliab(payorder(i),period+1));
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
        if length(curliab(payorder(i),:)) >= period+2  % these 2 ifs check if there is a debt/asset
            % change in the next cycle and avoid
            % overwriting it!
            if curliab(payorder(i),period+2) == 0
                curliab(payorder(i),period+2) = curliab(payorder(i),period+1) + payment(payorder(i));
            else
                curliab(payorder(i),period+2) = curliab(payorder(i),period+2) + payment(payorder(i));
            end
        else
            curliab(payorder(i),period+2) = curliab(payorder(i),period+1) + payment(payorder(i));
        end
        curliab(payorder(i),period+2) = curliab(payorder(i),period+2)*(1+rates(i)/n)^t;
        
    end
    
    for i=1:1:length(curasset(:,1))
        % check if any withdrawals hit this period
        for j=1:1:length(withdraws(:,1))
            if i==withdraws(j,2) && period+1 == withdraws(j,3)
                    % if so, update the asset value
                    curasset(i,period+1) = curasset(i,period+1) + withdraws(j,1);
            end
        end
        
        % apply payments & appreciation
        curasset(i,period+2) = curasset(i,period+1) + invpay(i) + extra*invdist(i);
        curasset(i,period+2) = curasset(i,period+2)*(1+asset(1,2)/n)^t;
    end
    
    %% calculate networth
    
    networth(period+2) = sum(curliab(:,period+2))+sum(curasset(:,period+2));
    
    %% increment time
    period = period+1;
    
end

%% Results Plotting

disp(['It will take you ' num2str(period) ' months or ' num2str(period/n) ' years to finish.'])

subplot(3,1,1)
for i=1:1:length(curliab(:,period+1))
    plot(curliab(i,:),'LineStyle','--')
    hold on
    legend(liabname)
end
subplot(3,1,2)
for i=1:1:length(curasset(:,period+1))
plot(curasset(i,:),'LineStyle',':')
hold on
legend(assetname)
end
subplot(3,1,3)
plot(networth,'LineStyle','-')