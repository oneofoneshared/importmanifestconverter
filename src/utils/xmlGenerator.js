export const generateXML = (data) => {
    const currentDate = new Date().toISOString();
    const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Calculate totals
    const totalPieces = data.hbls.reduce((sum, hbl) => sum + hbl.pieces.count, 0);
    const totalWeight = data.hbls.reduce((sum, hbl) => sum + hbl.weight.value, 0);
    const totalVolume = data.hbls.reduce((sum, hbl) => sum + hbl.volume.value, 0);

    return `<?xml version="1.0" encoding="UTF-8"?>
  <Message>
    <ID>${messageId}</ID>
    <SenderID>PLACEHOLDER001</SenderID>
    <ReceiverID>CODA</ReceiverID>
    <Date>${currentDate}</Date>
    <Type>Manifest</Type>
    <Version>2.0</Version>
    <Test>Yes</Test>
    
    <File>
      <Service>
        <Type>ImportCFS</Type>
        <Contact>
          <Name>AI Generated Contact</Name>
          <Email>contact@example.com</Email>
          <Telephone>1234567890</Telephone>
        </Contact>
      </Service>
      
      <ReferenceNo Type="Sender">AUTO-GEN-${Date.now()}</ReferenceNo>
      
      <Unit Type="ISO">
        <Number>${data.container.number}</Number>
        <Size Type="ISO">45G0</Size>
        <Description>40 Foot High Cube Dry Container</Description>
        <SealNo>${data.container.seal}</SealNo>
        <Date Type="COB"/>
      </Unit>
      
      <Transportation Mode="Ocean">
        <Carrier>
          <Name>${data.routing.carrier}</Name>
          <Code Type="SCAC">COSU</Code>
          <ReferenceNo>${data.container.voyage}</ReferenceNo>
        </Carrier>
        <Vessel>
          <Name>${data.container.vessel}</Name>
          <IMO>9555125</IMO>
          <MMSI>563187400</MMSI>
          <Callsign>9V7410</Callsign>
        </Vessel>
        <Routing>
          <Location Type="POL">
            <Code Type="UN">CNSHA</Code>
            <Name>${data.routing.pol}</Name>
            <Date Type="STD">2025-06-01</Date>
            <Date Type="ATD">2025-06-01</Date>
          </Location>
          <Location Type="POD">
            <Code Type="UN">USNYC</Code>
            <Name>${data.routing.pod}</Name>
            <Date Type="STA">2025-06-26</Date>
            <Date Type="ETA">2025-06-26</Date>
            <Date Type="ATA"/>
          </Location>
          <Location Type="FD">
            <Code Type="UN">USNYC</Code>
            <Name>${data.routing.pod}</Name>
            <Date Type="STA">2025-06-26</Date>
            <Date Type="ETA">2025-06-26</Date>
            <Date Type="ATA"/>
            <Pier>
              <Code Type="FIRMS">N775</Code>
              <Name>APM</Name>
            </Pier>
          </Location>
        </Routing>
      </Transportation>
      
      <Warehouse>
        <Code Type="FIRMS">EAY8</Code>
        <Name>CODA Logistics</Name>
      </Warehouse>
      
      <Commodity>FAK</Commodity>
      <Pallets>0</Pallets>
      <Pieces>
        <Code Type="UN">CT</Code>
        <Count>${totalPieces}</Count>
      </Pieces>
      <Volume UOM="CBM">${totalVolume.toFixed(3)}</Volume>
      <Weight UOM="KGM">${totalWeight.toFixed(3)}</Weight>
      
      <Lots>
  ${data.hbls.map((hbl, index) => `      <Lot>
          <ReferenceNo Type="Sender">SENDER-${index + 1}</ReferenceNo>
          <ReferenceNo Type="MBL">${data.container.number}</ReferenceNo>
          <ReferenceNo Type="HBL">${hbl.hbl}</ReferenceNo>
          <ReferenceNo Type="AMSHBL">${hbl.hbl}N</ReferenceNo>
          <PaymentTerms/>
          <HeadLoad>No</HeadLoad>
          <Pallets>0</Pallets>
          <Pieces>
            <Code Type="UN">CT</Code>
            <Count>${hbl.pieces.count}</Count>
          </Pieces>
          <Volume UOM="${hbl.volume.uom}">${hbl.volume.value}</Volume>
          <Weight UOM="${hbl.weight.uom}">${hbl.weight.value}</Weight>
          <MarksAndNos>${hbl.marks}</MarksAndNos>
          <Commodity>${hbl.commodity}</Commodity>
          <Instructions/>
          <FreightRelease>
            <Release>No</Release>
          </FreightRelease>
          <Customs/>
          <Parties>
            <Party Type="Shipper">
              <Name>${hbl.shipper}</Name>
              <Address/>
              <Contact/>
            </Party>
            <Party Type="Consignee">
              <Name>${hbl.consignee}</Name>
              <Address/>
              <Contact/>
            </Party>
          </Parties>
          <Routing>
            <Location Type="FD">
              <Code Type="UN">USNYC</Code>
              <Name>NEW YORK</Name>
            </Location>
          </Routing>
        </Lot>`).join('\n')}
      </Lots>
    </File>
  </Message>`;
};