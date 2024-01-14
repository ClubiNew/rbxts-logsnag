[![CI](https://github.com/ClubiNew/rbxts-logsnag/actions/workflows/ci.yml/badge.svg)](https://github.com/ClubiNew/rbxts-logsnag/actions/workflows/ci.yml) [![CD](https://github.com/ClubiNew/rbxts-logsnag/actions/workflows/cd.yml/badge.svg)](https://github.com/ClubiNew/rbxts-logsnag/actions/workflows/cd.yml) [![docs](https://clubinew.github.io/rbxts-logsnag/coverage.svg)](https://clubinew.github.io/rbxts-logsnag)

[LogSnag](https://logsnag.com/) is a SaaS for event logging and monitoring. This package provides a brief SDK over the [LogSnag API](https://docs.logsnag.com/).

## Example

```ts
const logsnag = new LogSnag({
    project: "project-name",
    token: "api-token"
});

// logs

const sales = logsnag.getChannel("sales");
sales.log("Product Sold", {
    description: `${player.Name} bought ${product.Name}!`
    user_id: player.UserId,
    icon: "🤑",
    tags: {
        product_id: product.Id,
        price: product.Price
    }
});

// insights

const visits = logsnag.getInsight("Visits");
visits.set(0);

Players.PlayerAdded.Connect(() => {
    visits.increment(1);
});

// identify

Players.PlayerAdded.Connect((player) => {
    logsnag.identify(tostring(player.UserId), {
        membership: player.MembershipType.Name
    });
});

```
