module fairsell::FairSell {
    use std::error;
    use std::signer;
    use std::string;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event;

    const E_SPLIT_NOT_100: u64 = 1;
    const E_NOT_ACTIVE: u64 = 2;
    const E_PRODUCT_NOT_FOUND: u64 = 3;
    const E_INCORRECT_AMOUNT: u64 = 4;

    struct Product has key, store {
        id: u64,
        middleman: address,
        manufacturer: address,
        price: u64,
        mfg_bps: u64,
        mm_bps: u64,
        active: bool,
        meta: string::String
    }

    struct Registry has key {
        products: vector<Product>,
        next_id: u64,
        add_events: event::EventHandle<NewProductEvent>,
        buy_events: event::EventHandle<PurchaseEvent>
    }

    struct NewProductEvent has drop, store { id: u64, middleman: address }
    struct PurchaseEvent has drop, store { id: u64, buyer: address, amount: u64 }

    /// Initialize registry for account
    public fun init(publisher: &signer) {
        if (!exists<Registry>(signer::address_of(publisher))) {
            move_to(publisher, Registry {
                products: vector::empty<Product>(),
                next_id: 0,
                add_events: event::new_event_handle<NewProductEvent>(publisher),
                buy_events: event::new_event_handle<PurchaseEvent>(publisher)
            });
        }
    }

    /// Middleman adds a product
    public entry fun add_product(
        mm: &signer,
        manufacturer: address,
        price: u64,
        mfg_bps: u64,
        mm_bps: u64,
        meta: string::String
    ) acquires Registry {
        assert!(mfg_bps + mm_bps == 10_000, error::invalid_argument(E_SPLIT_NOT_100));
        let reg = borrow_global_mut<Registry>(signer::address_of(mm));
        let id = reg.next_id;
        vector::push_back(&mut reg.products, Product {
            id,
            middleman: signer::address_of(mm),
            manufacturer,
            price,
            mfg_bps,
            mm_bps,
            active: true,
            meta
        });
        reg.next_id = id + 1;
        event::emit_event(&mut reg.add_events, NewProductEvent { id, middleman: signer::address_of(mm) });
    }

    /// Buyer purchases a product
    public entry fun buy(
        buyer: &signer,
        owner: address,
        product_id: u64,
        pay_coin: coin::Coin<AptosCoin>
    ) acquires Registry {
        let reg = borrow_global_mut<Registry>(owner);

        // Find product by id
        let mut found = false;
        let mut i = 0;
        let n = vector::length(&reg.products);
        while (i < n) {
            let p = &mut reg.products[i];
            if (p.id == product_id) {
                assert!(p.active, error::invalid_argument(E_NOT_ACTIVE));
                let amount = coin::value(&pay_coin);
                assert!(amount == p.price, error::invalid_argument(E_INCORRECT_AMOUNT));

                let mfg_amt = amount * p.mfg_bps / 10_000;
                let mm_amt = amount * p.mm_bps / 10_000;

                let mfg_coin = coin::extract(&mut pay_coin, mfg_amt);
                let mm_coin = coin::extract(&mut pay_coin, mm_amt);

                coin::deposit(&p.manufacturer, mfg_coin);
                coin::deposit(&p.middleman, mm_coin);

                event::emit_event(&mut reg.buy_events, PurchaseEvent {
                    id: p.id,
                    buyer: signer::address_of(buyer),
                    amount
                });

                found = true;
                break;
            }
            i = i + 1;
        }
        assert!(found, error::invalid_argument(E_PRODUCT_NOT_FOUND));
    }
}
