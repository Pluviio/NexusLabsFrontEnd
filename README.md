Documentation
USA Songbird RPC: "https://songbird-api.flare.network/ext/C/rpc"
USA Flare RPC: "https://flare-api.flare.network/ext/C/rpc"

{ September 20, 2023}
+Problem >An issue occured with getting the supported symbols for the Flare table. Where the error we were
getting was that getSupportedSymbols was not a function. After looking it over it was a problem with
the Proxy

+Solution >When it comes to setting up the registry keep in mind that you can use the FtsoRegistryProxy
address but do not use the ABI from it. Use the ABI from a normal FtsoRegistry, not the
proxy. >The reasono for this being that sometimes the ABI won't have all of what you need,
in our case we could see that the FtsoRegistryProxy did not have the method
getSupportedSymbols so that was the reason for our error. Once we used the ABI
from a non proxy registry we were able to bypass that error and get updated prices
as well as supported FTSO's successfully
